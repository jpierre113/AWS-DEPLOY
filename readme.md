
![](https://ga-dash.s3.amazonaws.com/production/assets/logo-9f88ae6c9c3871690e33280fcf557f33.png)
# Fullstack Deployment 


#### Lesson Objectives 

- To create a AWS Account
- Setup proper IAM identties
- Install Aws CLI 
- Add `.env` file for production build of our React project
- Setup `S3` to serve our React project
- Deploy your react project on to `S3`
- Setup an EC2 instance manually
- Deploy Spring Boot Microservces on to EC2 instance


### Agenda

- Sign-up For AWS
- Intro to AWS IAM 
- Intro to AWS CLI
- Deploy your React Project with S3
- Deploy your Spring Boot Microservices project with EC2
	- ssh into ec2 instance
	- setup docker
	- setup docker-compose


# Introduction to AWS

## What is the `cloud` / `AWS`?

![https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/AmazonWebservices_Logo.svg/1200px-AmazonWebservices_Logo.svg.png](https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/AmazonWebservices_Logo.svg/1200px-AmazonWebservices_Logo.svg.png)

The cloud is roughly a series of computers that exist in a data center that are logically or virtually strung together to create some sort of service. The cloud can be used to host images, videos, text, static websites and web applications. Amazon Web Services are a collection of cloud based web infrastructure tools that Amazon offers to the public.

They are focused on selling `Infrastructure as a Service`, their tools take the complexity away of hosting/co-locating and scaling a large web applications. AWS is essentially strives to be the `Operating System` of the web.

## What is EC2?

![https://www.pyimagesearch.com/wp-content/uploads/2014/10/gpu_amazon_ec2_logo.png](https://www.pyimagesearch.com/wp-content/uploads/2014/10/gpu_amazon_ec2_logo.png)

From the horse's mouth:

> Amazon Elastic Compute Cloud (Amazon EC2) is a web service that provides secure, resizable compute capacity in the cloud. It is designed to make web-scale cloud computing easier for developers.

> Amazon EC2’s simple web service interface allows you to obtain and configure capacity with minimal friction. It provides you with complete control of your computing resources and lets you run on Amazon’s proven computing environment. Amazon EC2 reduces the time required to obtain and boot new server instances to minutes, allowing you to quickly scale capacity, both up and down, as your computing requirements change. Amazon EC2 changes the economics of computing by allowing you to pay only for capacity that you actually use. Amazon EC2 provides developers the tools to build failure resilient applications and isolate them from common failure scenarios.

An `EC2 instance` runs on a computer located in one of many Amazon data centers around the world. The reason for this is  resilience and quick access to data. Many `EC2 instances` can run on one computer or across many computers. An `EC2 instance` is just a logical representation of a server, it doesn't really exist.

![https://image.slidesharecdn.com/awsoverviewv4-120611171440-phpapp02/95/overview-of-amazon-web-services-9-728.jpg?cb=1434492790](https://image.slidesharecdn.com/awsoverviewv4-120611171440-phpapp02/95/overview-of-amazon-web-services-9-728.jpg?cb=1434492790)

#### What is example of virtualization/emulation?

A couple of examples:

This is a virtual representation of a [Apple II](https://www.scullinsteel.com/apple2/)!

This is what the processor of the Appl II looks like [here](http://www.visual6502.org/JSSim/)



# Getting Started

### Sign-up for AWS

Create an account or sign in to the AWS Console: 

[https://aws.amazon.com/](https://aws.amazon.com/)

**NOTE:** You will need a credit/debit card to sign up!

# Create  a AWS IAM User

> As a best practice, do not use the AWS account root user for any task where it's not required. Instead, create a new IAM user for each person that requires administrator access. Then make those users administrators by placing the users into an "Administrators" group to which you attach the AdministratorAccess managed policy.

> Thereafter, the users in the administrators group should set up the groups, users, and so on, for the AWS account. All future interaction should be through the AWS account's users and their own keys instead of the root user. However, to perform some account and service management tasks, you must log in using the root user credentials. 

- Use your AWS account email address and password to sign in as the AWS account `root` user to the IAM console at https://console.aws.amazon.com/iam/.

- In the navigation pane, choose Users and then choose Add user.

- For User name, type a user name, such as `Administrator`. 

- Select the check box next to AWS Management Console access, select Custom password, and then type your new password in the text box. 

- Choose Next: Permissions.

- On the Set permissions for user page, choose Add user to group.

- Choose Create group.

- In the Create group dialog box, type the name for the new group. 


- In the policy list, select the check box next to AdministratorAccess. Then choose Create group.

- Back in the list of groups, select the check box for your new group. Choose Refresh if necessary to see the group in the list.

- Choose Next: Review to see the list of group memberships to be added to the new user. When you are ready to proceed, choose `Create user`.

### NOTE:

please check these options when creating a new user: 

- **Programmatic access** 
- **AWS Management Console access**

source: 

[https://docs.aws.amazon.com/IAM/latest/UserGuide/getting-started_create-admin-group.html](https://docs.aws.amazon.com/IAM/latest/UserGuide/getting-started_create-admin-group.html)

# Preparing Your React App

**Before you begin please remove the `proxy` key from your `package.json` if you're using one!!**

- You’ve got a React app working locally, but how can you deploy it to different environments?

- There’s production, staging, QA, and more… all with their own sets of servers and hostnames and maybe even features that should be enabled or disabled. Plus it still needs to work in development.

**Here is a way to do it**:

## env variables in React

- If you’re using Create React App, then you’ll have a global `process.env` available to get access to environment variables, including `process.env.NODE_ENV`, which will be set to `production` after a build.

- Additionally, Create React App will only have access to environment variables named starting with REACT_APP_, so, `process.env.REACT_APP_SKITTLE_FLAVOR` works but `process.env.SKITTLE_FLAVOR` will not.

- Environment variables can be set to whatever you want. One potential use case is to point to a particular host when making requests. At build time you can do something like this:

```
$ REACT_APP_HOST=http://ec2.mycontainer.com npm run build
```

- Which would result in something like:

```
const usersResponse = await axios.get(process.env.REACT_APP_HOST+'/users')
```

- Or if you're testing locally:

```
$ REACT_APP_HOST=http://ec2.mycontainer.com npm run start
```

- Which would also result in:

```
const usersResponse = await axios.get(process.env.REACT_APP_HOST+'/users')
```

Source: [https://daveceddia.com/multiple-environments-with-react/](https://daveceddia.com/multiple-environments-with-react/)

# Deploying a React Project with S3

- Navigate to the S3 service and click `Create Bucket`. Make up a clever name for your new bucket, then click `Create`.

- Click on the newly-created bucket. Within the Properties, open the Static Website Hosting tab, and select Enable website hosting: 
	- Fill in index.html for both the Index and Error Documents. By setting index.html as the Error Document, we can allow something like react-router to handle routes outside of the root.

![https://cdn-images-1.medium.com/max/1600/1*d11qJBxBsL-cvbo5jwQ5IA.png](https://cdn-images-1.medium.com/max/1600/1*d11qJBxBsL-cvbo5jwQ5IA.png)


- Open the Permissions tab, then select Edit bucket policy. 

![https://cdn-images-1.medium.com/max/1600/1*H8Y1oA2V5qiHknRwdhiAfg.png](https://cdn-images-1.medium.com/max/1600/1*H8Y1oA2V5qiHknRwdhiAfg.png)

- Open the CORS Configurationa and make sure you have these settings:

```XML
<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
<CORSRule>
    <AllowedOrigin>http://www.example1.com</AllowedOrigin>
    <AllowedMethod>PUT</AllowedMethod>
    <AllowedMethod>POST</AllowedMethod>
    <AllowedMethod>DELETE</AllowedMethod>
    <AllowedHeader>*</AllowedHeader>
</CORSRule>
<CORSRule>
    <AllowedOrigin>http://www.example2.com</AllowedOrigin>
    <AllowedMethod>PUT</AllowedMethod>
    <AllowedMethod>POST</AllowedMethod>
    <AllowedMethod>DELETE</AllowedMethod>
    <AllowedHeader>*</AllowedHeader>
</CORSRule>
<CORSRule>
    <AllowedOrigin>*</AllowedOrigin>
    <AllowedMethod>GET</AllowedMethod>
</CORSRule>
</CORSConfiguration>
```

- Add the contents of your build directory to this bucket. This can be done by clicking on the bucket and clicking Upload or Using the AWS CLI!

- That’s it! You can find the URL to your application back under the Static Website Hosting tab, labeled Endpoint.

Source: [https://medium.com/@omgwtfmarc/deploying-create-react-app-to-s3-or-cloudfront-48dae4ce0af](https://medium.com/@omgwtfmarc/deploying-create-react-app-to-s3-or-cloudfront-48dae4ce0af)

# Deploying with AWS CLI

You can streamline the deployment process with the AWS Command Line Interface. 

For example, you might write an npm script to run tests, build the application and push to your S3 bucket. Briefly:

- Install the AWS CLI.
- Create security credentials.
- Configure the CLI with aws configure. For example:

```
AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE
AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
Default region name [None]: us-west-2
Default output format [None]: json
```

Create a bucket and deploy the app:

```
// create a bucket
$ aws s3 mb s3://bucket-name
// list buckets
$ aws s3 ls
// build and deploy the app
$ npm run build && aws s3 sync build/ s3://bucket-name
```

Source:
[https://medium.com/@omgwtfmarc/deploying-create-react-app-to-s3-or-cloudfront-48dae4ce0af](https://medium.com/@omgwtfmarc/deploying-create-react-app-to-s3-or-cloudfront-48dae4ce0af)


# Preparing your Backend for EC2

### Enabling CORS

We'll need to use a `@Bean` annotation to add CORS to our application. What is `CORS` and what are `Beans`?

Cross-Origin Resource Sharing (`CORS`) is a mechanism that uses additional HTTP headers to let a user agent gain permission to access selected resources from a server on a different origin (domain) than the site currently in use. 

**We need to enable CORS so we can make requests from our `S3` domain, where our React app lives, to our `EC2` domain, where our Spring app lives.**

In Spring, the objects that form the backbone of your application and that are managed by the Spring IoC (Inversion of Control) container are called `beans`. A `bean` is an object that is instantiated, assembled, and otherwise managed by a Spring IoC container. Otherwise, a bean is simply one of many objects in your application. Beans, and the dependencies among them, are reflected in the configuration metadata used by a container.

The BeanFactory interface provides an advanced configuration mechanism capable of managing any type of object. ApplicationContext is a sub-interface of BeanFactory. It adds easier integration with Spring’s AOP (`Aspect Oriented Programming`) features; message resource handling (for use in internationalization), event publication; and application-layer specific contexts such as the WebApplicationContext for use in web applications.

Source: [https://docs.spring.io/spring/docs/current/spring-framework-reference/core.html](https://docs.spring.io/spring/docs/current/spring-framework-reference/core.html)

### Global CORS

Beans allow us to implement `Cross Cutting Concerns` through the use of the `@Bean` annotation. A `Cross Cutting Concern` can be applied to many methods or classes. In this case we will add this filter to our `ZuulGatewayApplication` class (directly after our main method). 

```Java
	@Bean
	public CorsFilter corsFilter() {

		final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		final CorsConfiguration config = new CorsConfiguration();
		config.setAllowCredentials(true);
		config.setAllowedOrigins(Collections.singletonList("*"));
		config.setAllowedHeaders(Collections.singletonList("*"));
		config.setAllowedMethods(Arrays.stream(Http.HttpMethod.values()).map(Http.HttpMethod::name).collect(Collectors.toList()));
		source.registerCorsConfiguration("/**", config);
		return new CorsFilter(source);
	}
```

So our class in our `api-gateway` would look like:

```Java
@SpringBootApplication
@EnableZuulProxy
public class ZuulGatewayApplication {

	public static void main(String[] args) {
		SpringApplication.run(ZuulGatewayApplication.class, args);
	}

	@Bean
	public CorsFilter corsFilter() {

		final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		final CorsConfiguration config = new CorsConfiguration();
		config.setAllowCredentials(true);
		config.setAllowedOrigins(Collections.singletonList("*"));
		config.setAllowedHeaders(Collections.singletonList("*"));
		config.setAllowedMethods(Arrays.stream(Http.HttpMethod.values()).map(Http.HttpMethod::name).collect(Collectors.toList()));
		source.registerCorsConfiguration("/**", config);
		return new CorsFilter(source);
	}
}
```

What do you think is the purpose of adding `CORS` to our `api-gateway` and not our individual controllers?

After you've added this filter please commit your code and push it to `github`!


# Deploying Backend on EC2


### Create an EC2 Instance 

1. Within the [AWS Console](https://console.aws.amazon.com/) navigation bar, click on **Services** and then **EC2**. 
2. On the top right of the navigation menu, make sure that **N. Virginia** is selected as the availability zone. 
3. Click on **AMIs** on the left hand side. 
4. We'll want to select a `Ubuntu AMI` for our server.
5. Select the instance size with the resources that you'll need. If you're unsure, use **t1.small**. Click on the **Next: Configure Instance Details** button.
6. For "Network", choose the default
7. For "Subnet", choose the default
8. [Optional] If you want to select an IAM role at this time do it now, it's not something you can change later on.
9. Click on the **Next: Add Storage** button
10. Click on the **Next: Add Tags** button.
11. Add any tags that will help you search for your instance: 
  - **Name**: [Enter a name for your server, e.g. `spring-microservices-server`] 
12. Click on the **Next: Configure Security Group** button.
13. **Open**  TCP ports `22`,`8761`,`8080` or `80`, and `5431`. 
14. Click on the **Review and Launch** button.
15. Review your settings and click on the **Launch** button.
16. When prompted create a new key pair. 


**Congratulations, you now have a running instance on AWS!**


#### Configuring your EC2 Instance: 

- Setting up docker on your EC2 instance

- We will need to setup `docker`, `docker-compose`, and `Java` (just in case)

#### SSH into your instance

- SSH or Secure Shell is a network communication protocol that enables two computers to communicate (c.f http or hypertext transfer protocol, which is the protocol used to transfer hypertext such as web pages) and share data. An inherent feature of ssh is that the communication between the two computers is encrypted meaning that it is suitable for use on insecure networks.

- SSH is often used to "login" and perform operations on remote computers but it may also be used for transferring data.

- Use the chmod command to make sure that your private key file isn't publicly viewable. For example, if the name of your private key file is my-key-pair.pem, use the following command:

```
chmod 400 /path/my-key-pair.pem
```

Use the ssh command to connect to the instance. You specify the private key (.pem) file and user_name@public_dns_name. For example, if you used an Ubuntu AMI, the user name is `ubuntu`.

```
ssh -i /path/my-key-pair.pem ubuntu@ec2-1-1-1-1.mycompute-1.amazonaws.com
```

#### Installing Docker

The Docker installation package available in the official Ubuntu 16.04 repository may not be the latest version. To get the latest and greatest version, install Docker from the official Docker repository. This section shows you how to do just that.

#### What is `apt-get`?

apt-get is the command-line tool for working with APT software packages.

APT (the Advanced Packaging Tool) is an evolution of the Debian .deb software packaging system. It is a rapid, practical, and efficient way to install packages on your system. Dependencies are managed automatically, configuration files are maintained, and upgrades and downgrades are handled carefully to ensure system stability.

Think of it as `brew` for `linux`.

First, add the GPG key for the official Docker repository to the system:

```
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
```

Add the Docker repository to APT sources:

```
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
```

Next, update the package database with the Docker packages from the newly added repo:

```
sudo apt-get update
```

Finally, install Docker:


```
sudo apt-get install -y docker-ce
```

Source: [https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-16-04](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-16-04)

#### Setting up docker-compose

The Docker community came up with a popular solution called Fig, which allowed you to use a single YAML file to orchestrate all your Docker containers and configurations. This became so popular that the Docker team decided to make Docker Compose based on the Fig source, which is now deprecated. Docker Compose makes it easier for users to orchestrate the processes of Docker containers, including starting up, shutting down, and setting up intra-container linking and volumes.


Although we can install Docker Compose from the official Ubuntu repositories, it is several minor version behind the latest release, so we'll install Docker Compose from the Docker's GitHub repository. The command below is slightly different than the one you'll find on the Releases page. By using the -o flag to specify the output file first rather than redirecting the output, this syntax avoids running into a permission denied error caused when using sudo.

```
sudo curl -L https://github.com/docker/compose/releases/download/1.18.0/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
```

Next we'll set the permissions:

```
sudo chmod +x /usr/local/bin/docker-compose
```

Then we'll verify that the installation was successful by checking the version:

```
docker-compose --version
```

By default, running the docker-compose command requires root privileges — that is, you have to prefix the command with sudo. 

```
sudo docker-compose up
```

you'll also need to:

```
sudo ./gradlew test
```

in case you wanted to run your tests on your production server.

Source: [https://www.digitalocean.com/community/tutorials/how-to-install-docker-compose-on-ubuntu-16-04](https://www.digitalocean.com/community/tutorials/how-to-install-docker-compose-on-ubuntu-16-04)


#### Install Java

If you'd like to run gradle on your `EC2` instance you'll need to install `Java`. These are the steps for installing `Java` on `Ubuntu`.


Add the Java repository to APT sources:

```
sudo add-apt-repository ppa:openjdk-r/ppa
```

Next, update the package database with the Java packages from the newly added repo:

```
sudo apt-get update
```

Finally install Open Source version of the `JDK` 

```
sudo apt-get install openjdk-8-jdk
```

Check the version of Java 
  
```
java -version
```


#### Final steps

### EC2

While you are still ssh'd into your `EC2` instance why dont we clone and run our Spring Boot repo:  

```
git clone https://github.com/mrcool/mycoolspringbootapp
```

and `cd` into it

```
cd mycoolrepo 
```

run docker (you'll notice how much faster it is than on a mac!)

```
sudo docker-compose up
```

### S3

Let's go back to our UI for a minute.

- Remember this command?

```
$ REACT_APP_HOST=http://ec2.mycoolcontaineraddress.com npm run build
```

- Now run it with the public DNS address of your `EC2` instance (you can find this in the control panel when you click on your instance). 

- Then run this again (or upload your files manually):

```
aws s3 sync build/ s3://bucket-name
```

And if all goes well your frontend will be able communicate to your backend! 


### Lab

Try deploying your Unit 2 project as well!

