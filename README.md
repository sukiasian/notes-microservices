# 1. Getting started with Notes App Microservices

Microservices are grouped into 1 repository but are ran separately - through docker-compose.

NOTE: Run kafka-server container before running any microservice.

Every single microservice has its own README so please follow the guides of each microservice.

## 2. Scalability

In case you want to scale horizontally microservices you can run them from their directories by command:

\$ docker-compose --env-file .env scale {service-name}={number-of-instances}

Please also note that host's ports are not defined for microservices to preserve scalability.

### 3. Interconnection of microservices

Before starting working with microservices please make sure that all 3 of them are run because they are tightly coupled.

#### 4. Achieved goals

-   Scalability
-   Database persistance
-   Object orientation
