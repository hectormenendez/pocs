FROM 861968717496.dkr.ecr.us-west-2.amazonaws.com/gikmx:base-v0.0.1

ADD . /app

WORKDIR /app

# Make Deno available globally as a fallback
RUN mv node_modules/.bin/deno /usr/local/bin/

