#!/usr/bin/env python

import argparse
import json
import os
import shutil
import subprocess
import sys
from collections import OrderedDict


def _get_base_dir():
    with open('./jsconfig.json') as f:
        j = json.load(f)

    try:
        return j['compilerOptions']['baseUrl']
    except KeyError:
        print("{}: Could not get proper base src path".format(__file__))
        sys.exit(1)

    return


def activate(target):
    """ Activates a package: write the required files for this
    """
    nm_folder = 'src/develop/{}/node_modules'.format(target)

    if os.path.exists(nm_folder):
        shutil.rmtree(nm_folder)

    if os.path.exists('jsconfig.json'):
        with open('jsconfig.json') as f:
            t = f.read()
    else:
        t = '{}'

    try:
        o = json.loads(t, object_pairs_hook=OrderedDict)
    except:
        print("Error in loading jsconfig.json file")
        sys.exit(137)

    if 'compilerOptions' not in o:
        targetpath = "develop/{}/src".format(target)

        if target == "@plone/volto":
            targetpath = "develop/volto"

        o['compilerOptions'] = {
            "paths": {
                target: [targetpath]
            },
            "baseUrl": "src"
        }
    else:
        paths = o['compilerOptions'].get('paths', {})
        paths[target] = ["develop/{}/src".format(target)]
        o['compilerOptions']['paths'] = paths

    with open('jsconfig.json', 'w') as f:
        f.write(json.dumps(o, indent=4, sort_keys=True))

    if os.path.exists('.eslintrc'):
        with open('.eslintrc') as f:
            t = f.read()
        try:
            j = json.loads(t, object_pairs_hook=OrderedDict)
        except:
            print("Error in loading .eslintrc file")
            sys.exit(137)
    else:
        j = {
            "extends": "./node_modules/@plone/volto/.eslintrc",
            "settings": {
                "import/resolver": {
                    "alias": {
                        "map": [
                            ["@plone/volto", "@plone/volto/src"],
                            ["@package", "./src"],
                            ["~", "./src"],
                        ], }}}}

    fmap = j['settings']['import/resolver']['alias']['map']
    fmap = [x for x in fmap if x[0] != target]
    fmap.append([target, "./src/develop/{}/src".format(target)])
    j['settings']['import/resolver']['alias']['map'] = fmap

    with open('.eslintrc', 'w') as f:
        f.write(json.dumps(j, indent=4, sort_keys=True))

    print("Activated package: {}".format(target))


def deactivate(target):
    """ Removes activation for a package
    """

    if not os.path.exists('jsconfig.json'):
        pass
    else:
        with open('jsconfig.json') as f:
            t = f.read()

        try:
            j = json.loads(t, object_pairs_hook=OrderedDict)
        except:
            print("Error in loading jsconfig.json file")
            sys.exit(137)

        if target in j \
                .get('compilerOptions', {}) \
                .get('paths', {}):
            del j['compilerOptions']['paths'][target]

            with open('jsconfig.json', 'w') as f:
                f.write(json.dumps(j, sort_keys=True, indent=4))

    if not os.path.exists('.eslintrc'):
        return

    with open('.eslintrc') as f:
        t = f.read()

    try:
        j = json.loads(t, object_pairs_hook=OrderedDict)
    except:
        print("Error in loading .eslintrc file")
        sys.exit(137)

    fmap = j['settings']['import/resolver']['alias']['map']
    fmap = [x for x in fmap if x[0] != target]
    j['settings']['import/resolver']['alias']['map'] = fmap

    with open('.eslintrc', 'w') as f:
        f.write(json.dumps(j, indent=4, sort_keys=True))

    print("Deactivated package: {}".format(target))


def activate_all():
    """ Activates all packages in mrs.developer.json
    """

    if not os.path.exists('./mrs.developer.json'):
        print("No Volto addons declared, no activation step needed")

        return

    with open('./mrs.developer.json') as f:
        j = json.load(f)

    for name in j.keys():
        activate(name)

        if name == "@plone/volto":
            continue

        pkgdir = os.path.join('src/develop/', format(name))

        if os.path.exists(pkgdir) and os.path.isdir(pkgdir):
            subprocess.call(['rm', 'package-lock.json'], cwd=pkgdir)
            subprocess.call(['npm', 'install'], cwd=pkgdir)
            subprocess.call(['rm', 'package-lock.json'], cwd=pkgdir)


def list_addons():
    """ Prints a list of addons available
    """

    if not os.path.exists('./mrs.developer.json'):
        return

    with open('./mrs.developer.json') as f:
        j = json.load(f)

    print(" ".join(j.keys()))


def _get_addons():
    if not os.path.exists('./mrs.developer.json'):
        return {}

    with open('./mrs.developer.json') as f:
        j = json.load(f)

    return j


class Addon:
    """ Class representing an addon
    """

    git_repo = None
    git_branch = None
    local_path = None

    def __init__(self, name):
        self.name = name

    @classmethod
    def fromconfig(cls, name, jsconfig, mrdeveloper):
        """
        """
        addon = cls(name)

        if name not in mrdeveloper:
            print("{}: No {} addon defined in mrs.developer.json".format(
                __file__, name))
            sys.exit(1)

        conf = mrdeveloper[name]
        addon.get_repo = conf['url']
        addon.git_branch = conf.get('branch', 'master')

        paths = jsconfig['compilerOptions']['paths']

        if name not in paths:
            print("{}: No {} addon defined in mrs.developer.json".format(
                __file__, name))
            sys.exit(1)

        addon.local_path = os.path.join(_get_base_dir(), paths[name][0])

        return addon

    def update(self):
        print("Updating {}".format(self.name))
        self.init()
        subprocess.call(['git', 'pull'], cwd=self.local_path)

    def init(self):
        if not os.path.exists(self.local_path):
            print("Path not found {}, cloning".format(self.local_path))
            subprocess.call(['git', 'clone', self.git_repo, self.local_path])


def develop():
    """ Refreshes addon packages
    """
    with open('./jsconfig.json') as jf:
        j = json.load(jf)

    with open('./mrs.developer.json') as mf:
        m = json.load(mf)

    addons = m.keys()

    for name in addons:
        addon = Addon.fromconfig(name, j, m)
        addon.update()


if __name__ == "__main__":
    parser = argparse.ArgumentParser('Volto development helper')
    parser.add_argument('op', type=str,
                        choices=['activate', 'deactivate',
                                 'activate-all', 'list', 'develop'],
                        help="Operation type")
    parser.add_argument('--target', type=str, default='', help="target name",
                        dest="target")
    args = parser.parse_args()

    {
        'develop': develop,
        'activate-all': activate_all,
        'list': list_addons,
        'activate': lambda: activate(args.target),
        'deactivate': lambda: deactivate(args.target)
    }[args.op]()
