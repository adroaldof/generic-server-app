FROM node:7.10.0

ENV HOME_DIR=/home/app \
  WORK_DIR=/home/app/library

COPY ./package.json $WORK_DIR/

WORKDIR $WORK_DIR
RUN npm cache clean && \
  npm install -g gulp && \
  npm install -g gulp-cli && \
  npm install # --silent --progress=false

COPY . $WORK_DIR/
EXPOSE 3001

CMD ["npm", "start"]
