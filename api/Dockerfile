FROM eeacms/plone-backend
ENV PROFILES="eea.kitkat:default"

COPY requirements.txt constraints.txt /app/
RUN ./bin/pip install -r requirements.txt -c constraints.txt ${PIP_PARAMS}
