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
		openssl \
		nodejs npm

RUN pip3 install -r deploy/requirements.txt

# Create the nginx_runner user to run the nginx server
RUN addgroup -S nginx_runner && adduser -S --no-create-home nginx_runner -G nginx_runner 

# https://unix.stackexchange.com/questions/104171/create-ssl-certificate-non-interactively
# We are okay creating generating this cert in the Dockerfile because the web server sits in a private
# subnet in AWS behind a load balancer with a CA signed cert
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
	     -keyout /etc/ssl/private/nginx-selfsigned.key \
	     -out /etc/ssl/certs/nginx-selfsigned.crt \
	     -subj "/C=US/ST=Denial/L=Springfield/O=Dis/CN=localhost"

# Copy server config files to appropriate locations in container
COPY deploy/nginx.conf /etc/nginx/
COPY deploy/proxy_params /etc/nginx/
COPY deploy/supervisord.conf /etc/

# Create logfile directories if they don't exist
RUN mkdir -p /run/pid/ /var/log/supervisor/
RUN cd /app/client && npm install && npm run build && cd /app

CMD [ "/usr/bin/supervisord","--configuration=/etc/supervisord.conf" ]
