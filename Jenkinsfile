pipeline {
  agent any

  environment {
    GIT_NAME="bise-frontend"
    NAMESPACE = "@eeacms"
    registry = "eeacms/bise-frontend"
    template = "templates/volto-bise"
    // RANCHER_STACKID = "1st1823"
    RANCHER_ENVID = "1a333018"
    dockerImage = ''
    tagName = ''
    SONARQUBE_TAG = "biodiversity.europa.eu"    
  }


  stages {

   stage('Integration tests') {
      parallel {
        stage('Cypress') {
          when {
            environment name: 'CHANGE_ID', value: ''           
          }
          steps {
            node(label: 'docker') {
              script {
                try {
                  sh '''docker pull plone; docker run -d --name="$BUILD_TAG-plone" -e SITE="Plone" -e PROFILES="profile-plone.restapi:blocks" plone fg'''
                  sh '''docker pull eeacms/volto-project-ci:12; docker run -i --name="$BUILD_TAG-cypress" --link $BUILD_TAG-plone:plone -e GIT_NAME=$GIT_NAME -e GIT_BRANCH="$BRANCH_NAME" -e GIT_CHANGE_ID="$CHANGE_ID" eeacms/volto-project-ci:12 cypress'''
                } finally {
                  try {
                    sh '''rm -rf cypress-reports cypress-results'''
                    sh '''mkdir -p cypress-reports cypress-results'''
                    sh '''docker cp $BUILD_TAG-cypress:/opt/frontend/my-volto-project/cypress/videos cypress-reports/'''
                    sh '''docker cp $BUILD_TAG-cypress:/opt/frontend/my-volto-project/cypress/reports cypress-results/'''
                    archiveArtifacts artifacts: 'cypress-reports/videos/*.mp4', fingerprint: true
                  }
                  finally {
                    catchError(buildResult: 'SUCCESS', stageResult: 'SUCCESS') {
                        junit testResults: 'cypress-results/**/*.xml', allowEmptyResults: true
                    }
                    sh script: "docker stop $BUILD_TAG-plone", returnStatus: true
                    sh script: "docker rm -v $BUILD_TAG-plone", returnStatus: true
                    sh script: "docker rm -v $BUILD_TAG-cypress", returnStatus: true
                  }
                }
              }
            }
          }
        }
        
        stage("Docker test build") {
             when {
               not {
                environment name: 'CHANGE_ID', value: ''
               }
               not {
                 buildingTag()
               }
               environment name: 'CHANGE_TARGET', value: 'master'
             }
             environment {
              IMAGE_NAME = BUILD_TAG.toLowerCase()
             }
             steps {
               node(label: 'docker-host') {
                 script {
                   checkout scm
                   try {
                     dockerImage = docker.build("${IMAGE_NAME}", "--no-cache .")
                   } finally {
                     sh script: "docker rmi ${IMAGE_NAME}", returnStatus: true
                   }
                 }
               }
             }
          }
          
        
      }
    }

    
    stage('Pull Request') {
      when {
        not {
          environment name: 'CHANGE_ID', value: ''
        }
        environment name: 'CHANGE_TARGET', value: 'master'
      }
      steps {
        node(label: 'docker') {
          script {
            if ( env.CHANGE_BRANCH != "develop" &&  !( env.CHANGE_BRANCH.startsWith("hotfix")) ) {
                error "Pipeline aborted due to PR not made from develop or hotfix branch"
            }
           withCredentials([string(credentialsId: 'eea-jenkins-token', variable: 'GITHUB_TOKEN')]) {
            sh '''docker pull eeacms/gitflow'''
            sh '''docker run -i --rm --name="$BUILD_TAG-gitflow-pr" -e GIT_CHANGE_TARGET="$CHANGE_TARGET" -e GIT_CHANGE_BRANCH="$CHANGE_BRANCH" -e GIT_CHANGE_AUTHOR="$CHANGE_AUTHOR" -e GIT_CHANGE_TITLE="$CHANGE_TITLE" -e GIT_TOKEN="$GITHUB_TOKEN" -e GIT_BRANCH="$BRANCH_NAME" -e GIT_CHANGE_ID="$CHANGE_ID" -e GIT_ORG="$GIT_ORG" -e GIT_NAME="$GIT_NAME" -e LANGUAGE=javascript eeacms/gitflow'''
           }
          }
        }
      }
    }

  
    stage('Release') {
      when {
        allOf {
          environment name: 'CHANGE_ID', value: ''
          branch 'master'
        }
      }
      steps {
        node(label: 'docker') {
          withCredentials([string(credentialsId: 'eea-jenkins-token', variable: 'GITHUB_TOKEN')]) {
            sh '''docker pull eeacms/gitflow'''
            sh '''docker run -i --rm --name="$BUILD_TAG-gitflow-master" -e GIT_BRANCH="$BRANCH_NAME" -e GIT_NAME="$GIT_NAME" -e GIT_TOKEN="$GITHUB_TOKEN" -e LANGUAGE=javascript eeacms/gitflow'''
          }
        }
      }
    }

    stage('Build & Push ( on tag )') {
      when {
        buildingTag()
      }
      steps{
        node(label: 'docker-host') {
          script {
            checkout scm
            if (env.BRANCH_NAME == 'master') {
              tagName = 'latest'
            } else {
              tagName = "$BRANCH_NAME"
            }
            try {
              dockerImage = docker.build("$registry:$tagName", "--no-cache .")
              docker.withRegistry( '', 'eeajenkins' ) {
                dockerImage.push()
              }
            } finally {
              sh "docker rmi $registry:$tagName"
            }
          }
        }
      }
    }
    
    stage('Release catalog ( on tag )') {
      when {
        buildingTag()
      }
      steps{
        node(label: 'docker') {
          withCredentials([string(credentialsId: 'eea-jenkins-token', variable: 'GITHUB_TOKEN'),  usernamePassword(credentialsId: 'jekinsdockerhub', usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_PASS')]) {
           sh '''docker pull eeacms/gitflow; docker run -i --rm --name="$BUILD_TAG-release"  -e GIT_BRANCH="$BRANCH_NAME" -e GIT_NAME="$GIT_NAME" -e DOCKERHUB_REPO="$registry" -e GIT_TOKEN="$GITHUB_TOKEN" -e DOCKERHUB_USER="$DOCKERHUB_USER" -e DOCKERHUB_PASS="$DOCKERHUB_PASS"  -e RANCHER_CATALOG_PATHS="$template" -e GITFLOW_BEHAVIOR="RUN_ON_TAG" eeacms/gitflow'''
          }
        }
      }
    }
    
    stage('Upgrade demo ( on tag )') {
      when {
        not {
          environment name: 'RANCHER_STACKID', value: ''
        }
        buildingTag()
      }
      steps {
        node(label: 'docker') {
          withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'Rancher_dev_token', usernameVariable: 'RANCHER_ACCESS', passwordVariable: 'RANCHER_SECRET'],string(credentialsId: 'Rancher_dev_url', variable: 'RANCHER_URL')]) {
            sh '''wget -O rancher_upgrade.sh https://raw.githubusercontent.com/eea/eea.docker.gitflow/master/src/rancher_upgrade.sh'''
            sh '''chmod 755 rancher_upgrade.sh'''
            sh '''./rancher_upgrade.sh'''
         }
        }
      }
    }

    stage('Update SonarQube Tags') {
      when {
        not {
          environment name: 'SONARQUBE_TAG', value: ''
        }
        buildingTag()
      }
      steps{
        node(label: 'docker') {
          withSonarQubeEnv('Sonarqube') {
            withCredentials([string(credentialsId: 'eea-jenkins-token', variable: 'GIT_TOKEN')]) {
              sh '''docker pull eeacms/gitflow'''
              sh '''docker run -i --rm --name="${BUILD_TAG}-sonar" -e GIT_NAME=${GIT_NAME} -e GIT_TOKEN="${GIT_TOKEN}" -e SONARQUBE_TAG=${SONARQUBE_TAG} -e SONARQUBE_TOKEN=${SONAR_AUTH_TOKEN} -e SONAR_HOST_URL=${SONAR_HOST_URL}  eeacms/gitflow /update_sonarqube_tags.sh'''
            }
          }
        }
      }
    }
  }


  post {
    always {
      cleanWs(cleanWhenAborted: true, cleanWhenFailure: true, cleanWhenNotBuilt: true, cleanWhenSuccess: true, cleanWhenUnstable: true, deleteDirs: true)
    }
    changed {
      script {
        def details = """<h1>${env.JOB_NAME} - Build #${env.BUILD_NUMBER} - ${currentBuild.currentResult}</h1>
                         <p>Check console output at <a href="${env.BUILD_URL}/display/redirect">${env.JOB_BASE_NAME} - #${env.BUILD_NUMBER}</a></p>
                      """
        emailext(
        subject: '$DEFAULT_SUBJECT',
        body: details,
        attachLog: true,
        compressLog: true,
        recipientProviders: [[$class: 'DevelopersRecipientProvider'], [$class: 'CulpritsRecipientProvider']]
        )
      }
    }
  }
}
