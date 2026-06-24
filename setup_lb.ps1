# Create Internet NEG
gcloud compute network-endpoint-groups create hydra-backend-neg --network-endpoint-type=INTERNET_IP_PORT --global

# Add Endpoints
gcloud compute network-endpoint-groups update hydra-backend-neg --add-endpoint="ip=213.232.235.181,port=80" --add-endpoint="ip=31.97.79.34,port=80" --add-endpoint="ip=45.93.137.164,port=80" --global

# Create Backend Service with CDN Enabled
gcloud compute backend-services create hydra-backend-service --global --load-balancing-scheme=EXTERNAL --protocol=HTTP --enable-cdn

# Add NEG to Backend Service
gcloud compute backend-services add-backend hydra-backend-service --network-endpoint-group=hydra-backend-neg --global-network-endpoint-group --global

# Create URL Map
gcloud compute url-maps create hydra-url-map --default-service=hydra-backend-service --global

# Create HTTP Proxy
gcloud compute target-http-proxies create hydra-http-proxy --url-map=hydra-url-map

# Create Forwarding Rule to link the VIP IP
gcloud compute forwarding-rules create hydra-http-forwarding-rule --address=hydra-global-ip --global --target-http-proxy=hydra-http-proxy --ports=80
