FROM alpine:latest

LABEL maintainer="garouttc@oregonstate.edu"

WORKDIR /app

COPY . /app

# Install dependencies
RUN apk add --update --no-cache \
		linux-headers \
		bash \
		g++ \
		python3 \
		py3-pip \
		python3-dev \
		nginx \
		supervisor \
		nodejs npm

RUN pip3 install -r deploy/requirements.txt

# Create the nginx_runner user to run the nginx server
RUN addgroup -S nginx_runner && adduser -S --no-create-home nginx_runner -G nginx_runner 

# Copy server config files to appropriate locations in container
COPY deploy/nginx.conf /etc/nginx/
COPY deploy/proxy_params /etc/nginx/
COPY deploy/supervisord.conf /etc/

# Create logfile directories if they don't exist
RUN mkdir -p /run/pid/ /var/log/supervisor/
RUN cd /app/client && npm install && cd /app

CMD [ "/usr/bin/supervisord","--configuration=/etc/supervisord.conf" ]
