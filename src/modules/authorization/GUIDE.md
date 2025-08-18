This is a document to help understand requeriments for this module. 


## Overview 
The module is a biometric verification module that provides enterprise-grade face recognition capabilities with privacy-first design. It uses cloud-based face recognition providers (AWS Rekognition, Azure Face API, etc.) for face detection and feature extraction, implementing secure API integrations and similarity calculation algorithms for reliable identity verification, we call this authorization module

## Must have features (methods/functions we are exporting)
- A image 2 image face comparasion function that is safe to use in production, which means wrong faces should not be able to bypass or match. 

- A image 2 video face comparasion, basically we need to implement a live camera verification that compares with a base image of the user face, this should be able to have proper props to control the verification process, and to have a liveness check within challenges. 

- A image quality check, so when the first image is uploaded (let's say for a database in the client), the user will be able to have a feedback if that image is good enough for the use case. 

So the library will export 3 methods as compareByImage, compareByLiveVideo, and checkImageQuality 

To chunk down exports we can use a better way to initialize this system as 
const wauth = new WinterAuthenticator()

wauth.compareByImage()
wauth.compareByLiveVideo()
wauth.checkImageQuality()
wauth.config.. 

## compareByImage 

This method will take 2 images as input, and return a similarity score, and a boolean indicating if the images match or not, more image metadata can be available inside the object itself, ideally we want to have good feedback and be more open about the process, so the user can understand why the images match or not. 

## compareByLiveVideo 

This method will take a video stream as input, and return a similarity score, and a boolean indicating if the video stream matches or not, more image metadata can be available inside the object itself, it's very important to identify the dificulties of such verification, the implementation here must be made in a way that we can implement securiy levels, challenges and have a REAL LIVE VERIFICATION and not another image 2 image verification by checking pixels from the camera, this will not work, we are taking this approach to make sure the verification works cross platforms so mobile and desktop can use the same verification process.

## checkImageQuality 

This method will take an image as input, and return a boolean and metadata information indicating if the image is good enough for the use case, more image metadata can be available inside the object itself, it must be able to verify and identify the user face and user information, if possible, to extract good descriptors, mesh or anything else that could help with the verification process later. 

### Security Strength 

We want to have inside the module and inside each function props to handle security streght, this will help us to make sure the verification process is secure and not vulnerable to attacks, we can have low to maximum, where each one will have different steps to compare, and having a SINGLE PROPS for challenge, like a boolean, where we decide if there will be a challenge or not (challenge will always be look left and then look right, like KYC process). 

### Liveness check 

For compareByLiveVideo we want to have a liveness check to make sure it's not a object in the screen (as another phone with a face video) or something else, the idea here is to make sure the video content itself is a live video, for the image 2 image this is not necessary because we can't control it much. 

### challenges 

We want to have a challenge system to make sure the user is not spoofing the verification process, the idea here is to make sure the user is not spoofing the verification process, we can have a single prop for challenge, like a boolean, where we decide if there will be a challenge or not (challenge will always be look left and then look right, like KYC process), the challenge can be opted in or out based on that props 

### Coding notes

It's important to understand how difficult it is to bring a security system like this to life so we can make sure we are not vulnerable to attacks, that we are using proper ways to handle everything and we are always monitoring the cloud provider APIs we are using to do these verifications. 

### UI / Client
We are not handling or doing any ui or client part with the library, it is up to who is using the library to select how they will use this system. 

### Exports

We can export everything we need (the main 3 functions) and also export any other function/low level api to give user access to configurations, like a way to change a config file ( const wauth.config = new config({...}) and change or modify the config object and pass this again when creating it). if that makes sense. The more modular, the best. 

### Performance 
we should make sure the library is fast so using proper HTTP client configurations and connection pooling is important, and also make sure we are always reusing provider instances across the module to avoid initialization overhead and memory issues. 


useful links:
AWS Rekognition: https://docs.aws.amazon.com/rekognition/
Azure Face API: https://docs.microsoft.com/en-us/azure/cognitive-services/face/
Provider setup guide: ./providers/README.md

## Notes

The most important note here is to make sure we are not making assumptions when writing code

## Testing

We don't need to write tests or worry too much about biome linting atm as I don't believe we really can test much, under /web/src we can implement tests. The whole idea with tests is to test the flow we want here. 


## file structure
Please do not create big larger files (200 lines or more) just create new files for specific functions or methods or anything that is necessary, even types and interfaces, create proper folders for each and follow best practices so we can avoid really large files bloating in context.


## flow 

In a system where we record traceability records in blockchain is necessary to have a 3 step layer where the first layer is authorized people who can upload (no facial verification), the second step is the review stage where field supervisors will review everything uploaded and approve, edit or deny then and if they approve something, they go thru the facial verification. The admin of that system will create proper credentials and upload a single image to that user into the database of choice and use the library to compare both pictures, for all pictures uploaded or specific needs we will also request or collect gps information. After reviewing we mint and tokenize the record in the blockchain where it will become immutable. 