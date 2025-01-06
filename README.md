# **Ft_transcendence**

**ft_transcendence** is a modern project that reimagines the classic Pong game with a focus on scalability, security, and advanced gameplay features. By leveraging microservices architecture and modern web technologies, we have created a robust and dynamic platform that goes beyond the traditional Pong experience.


https://github.com/user-attachments/assets/e14e6261-0ae9-47cd-9937-091faac4cb7d


---

## **Project Overview**

This project focuses on creating a modern and secure platform using advanced technologies and design principles. We built a REST API with the **Django framework**, following **Clean** and **Onion Architecture** to ensure a maintainable and scalable structure.

We explored **microservices** to divide the system into smaller, independent components and used **Docker** for easy deployment. An **API Gateway** was implemented to route requests to the correct services, while **middleware** ensures security by validating **JWT tokens**.

The frontend is designed as a **Single Page Application (SPA)** for dynamic updates without reloading. We also used **Three.js** to create a visually engaging 3D game experience.

To enhance user security, we added **Two-Factor Authentication (2FA)** and **SMTP** for email services.

This project combines **scalability**, **security**, and **dynamic features** to deliver a robust and innovative platform.

---

## **Modules Overview**

The project is organized into several **major** and **minor** modules, each contributing to a specific aspect of functionality, architecture, or usability. Below is a detailed summary:

---

### **1. Web Modules**

- **Major Module: Use a Framework to Build the Backend**  
  The backend is developed using the **Django framework**. Clean and Onion Architecture are implemented to ensure clear separation of concerns, maintainability, and scalability.

- **Minor Module: Use a Framework or Toolkit to Build the Frontend**  
  The frontend is built with **vanilla JavaScript** and **Bootstrap**, offering a dynamic and responsive user interface that enhances usability and design consistency.

- **Minor Module: Use a Database for the Backend**  
  **PostgreSQL** is utilized as the backend database to ensure data consistency, high performance, and seamless integration with the system's components.

---

### **2. User Management and Security Modules**

- **Major Module: Standard User Management and Authentication**  
  Secure **user** registration, login, and social features like friends and match history. 

- **Major Module: Implement Two-Factor Authentication (2FA) and JWT**  
  Implement **2FA** for security and **JWT** for session management.

- **Major: Remote Authentication**
  Implements OAuth 2.0 with 42 authentication for secure login and token management.
---

### **3. DevOps Modules**

- **Major Module: Designing the Backend as Microservices**  
  Modular design using **microservices**, promoting scalability and independent deployment. 

---

### **4. Graphics Modules**

- **Major Module: Implementing Advanced 3D Techniques**  
  Using **Three.js/WebGL** for an immersive, visually engaging gaming experience.

---

### **5. Accessibility Modules**

- **Minor Module: Support on All Devices**  
  Fully **responsive** design for desktops, tablets, and smartphones, supporting touch, mouse, and keyboard.

---

####
These modules provide a secure, scalable, and visually engaging Pong experience, laying the foundation for future enhancements and innovations.

---

# **Ft_transcendence - Setup Instructions**

## **Requirements:**

Before you begin, ensure that you have the following tools installed:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## **Steps:**

### 1. Clone the Repository

Clone the repository to your local machine:

    git clone https://github.com/Uchimann/ft_transcendence.git

### 2. Navigate to the Project Directory

Change to the project directory:

    cd ft_transcendence

### 3. Set Up Environment Variables

Configure the necessary environment variables

### 4. Build the Docker Containers

Use Docker Compose to build and start the project:

    docker-compose up --build

### 5. Access the Application

Once the build is complete, open your browser and go to the following address:

    https://localhost:8008

