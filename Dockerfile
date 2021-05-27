# Based on https://github.com/plone/volto/blob/master/entrypoint.sh
FROM node:12-stretch-slim

# Update apt packages
RUN apt-get update && apt-get install -y git

COPY . /opt/frontend/
RUN chown -R node /opt/frontend/
RUN rm -rf /opt/frontend/src/addons/*

WORKDIR /opt/frontend/

RUN npm install -g mrs-developer
USER node

ARG MAX_OLD_SPACE_SIZE=8192
ENV NODE_OPTIONS=--max_old_space_size=$MAX_OLD_SPACE_SIZE

RUN cd /opt/frontend

RUN yarn develop
RUN RAZZLE_API_PATH=VOLTO_API_PATH RAZZLE_INTERNAL_API_PATH=VOLTO_INTERNAL_API_PATH yarn

RUN RAZZLE_API_PATH=VOLTO_API_PATH RAZZLE_INTERNAL_API_PATH=VOLTO_INTERNAL_API_PATH yarn build \
 && rm -rf /home/node/.cache

EXPOSE 3000 3001 4000 4001

ENTRYPOINT ["/opt/frontend/entrypoint-prod.sh"]
CMD ["yarn", "start:prod"]
USER root
