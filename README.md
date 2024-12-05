# Assume-Role---AWS
When you have assume role and get temp creds then every time when your creds are about to expire it send the req and get new creds




Assume role - Assume role give you by STS when a user want a temporary request so without making any key for him we create a assume role 

for this we hit the sts and we get three keys - access key , secret access key and session key 
these keys bind with AWS signer and then you can use these keys for any service 
