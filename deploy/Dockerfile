FROM debian:buster

LABEL maintainer="garouttc@oregonstate.edu"

WORKDIR /app

COPY . /app

# Install dependencies
RUN apt-get update -y && \
		apt-get install -y python3 python3-pip python3-dev nginx supervisor

RUN pip3 install -r deploy/requirements.txt

# Create the nginx user to run the nginx server
RUN useradd --no-create-home nginx

# Remove default nginx configs
RUN rm /etc/nginx/sites-enabled/default
RUN rm -r /root/.cache

# Copy server config files to appropriate locations in container
COPY deploy/nginx.conf /etc/nginx/
COPY deploy/uwsgi.ini /etc/uwsgi/
COPY deploy/supervisord.conf /etc/

# Create logfile directories if they don't exist
RUN mkdir -p /run/pid/ /var/log/supervisor/

# ENTRYPOINT [ "python3" ]

CMD [ "/usr/bin/supervisord" ]
