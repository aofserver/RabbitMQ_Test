FROM rabbitmq:management-alpine
USER root
RUN rabbitmq-plugins enable rabbitmq_mqtt