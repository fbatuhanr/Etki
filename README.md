# “ETKI: A Mobile Event Management Platform with Real-Time Group Messaging and Social Features” 

### ABSTRACT
<p>
Etki is a mobile first event management platform built with React Native and Node.js, designed to support social interaction through real-world activities. Users can register, log in, create or join events, and communicate with other participants through real-time group messaging powered by Socket.IO. The platform includes editable user profiles, secure authentication via JWT, and cloud-based media uploads through Google Firebase Storage. Etki also offers a friendship system, allowing users to search for others, send or manage friend requests, and control profile visibility. Event history and participant data remain private unless the user has a public profile or a confirmed friendship. Event creators can update their event details, view participants, and remove attendees when needed. The backend architecture is built with MongoDB and a modular API structure that separates controller and service layers. This setup ensures maintainability and scalability. While the current version includes core functionality, the platform is designed to support future features such as push notifications, calendar integration, analytics, and premium membership models. Etki is fully deployed on Railway, and the codebase is publicly available as an open-source project on GitHub.
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/24d8adff-4903-443f-a9db-b6f22df65c2d" width="260" />
  <img src="https://github.com/user-attachments/assets/4e596c21-fe73-4ad2-9bb2-63e011284a47" width="260" />
  <img src="https://github.com/user-attachments/assets/51f961e3-cd7e-4320-9cdf-4a83e64c48d6" width="260" />
</p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/ca9e78ab-023b-44a7-a670-92cf2a63476f" width="260" />
  <img src="https://github.com/user-attachments/assets/9d380b2c-0720-46ca-a7a8-000fb0553442" width="260" />
  <img src="https://github.com/user-attachments/assets/0839d995-1fe5-47a9-8b6a-181020d1dff0" width="260" />
</p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/53f4fc7f-1240-4aa6-b540-dec6380d9b4d" width="260" />
  <img src="https://github.com/user-attachments/assets/bafc53a0-4618-4551-8e1c-1d7f3c734879" width="260" />
  <img src="https://github.com/user-attachments/assets/d6205f09-a6f3-41b4-ad96-1886301486e2" width="260" />
</p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/6822fa56-1502-42ef-8eab-c5bef770883e" width="260" />
  <img src="https://github.com/user-attachments/assets/a96d2a73-2d53-4f4a-8854-c030a1c84d53" width="260" />
  <img src="https://github.com/user-attachments/assets/604d982b-af07-413b-aa72-6d0193eb2907" width="260" />
</p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/6ea271e0-5081-4841-a6e9-2db3d9a89b06" width="260" />
  <img src="https://github.com/user-attachments/assets/75db8148-08fc-4ee6-9932-9320294a1936" width="260" />
  <img src="https://github.com/user-attachments/assets/604d982b-af07-413b-aa72-6d0193eb2907" width="260" />
</p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/83eb28f8-ecd6-4b8c-8308-dc03deede439" width="260" />
  <img src="https://github.com/user-attachments/assets/9b57faad-9cc7-436b-ad97-617917c7c82e" width="260" />
  <img src="https://github.com/user-attachments/assets/c5cd26be-44d9-4f37-b4fd-4379c35c16c3" width="260" />
</p>

### METHODS
<p>
The project was developed using an agile and iterative approach to ensure continuous testing and feedback. The mobile frontend was built with React Native (Expo), using Redux for state management and React Hook Form for form handling. Navigation and animations were implemented via React Navigation and Reanimated. The backend was developed with Node.js and Express, following a modular structure with separated controller, service, and model layers. MongoDB, accessed through Mongoose, stores users, events, messages, and friend requests. Real-time communication was implemented using Socket.IO, with participants grouped into event-specific channels. Authentication is secured with JWT and bcrypt, while media uploads like profile images are handled via Firebase Storage. All major features, including event creation, editing, participation, messaging, and friend systems, were built incrementally and tested in isolation for maintainability and scalability.
</p>

### TECHNOLOGIES
The mobile frontend was built using React Native (Expo), with Redux and Redux Persist for state management. Forms are handled via React Hook Form, and navigation is implemented with React Navigation and Reanimated. Styling is achieved using TailwindCSS through the NativeWind library. Real-time communication is supported by Socket.IO Client, while HTTP requests and feedback messages utilize Axios and Toastify. User media such as profile images are uploaded to Google Firebase Storage, and authentication tokens are processed using JWT Decode. The backend API is developed using Node.js and Express, structured with modular service-controller architecture. MongoDB is used as the primary database via the Mongoose ODM. Real-time messaging between users is powered by Socket.IO, and secure authentication is provided through JWT and bcrypt. Environment configuration and middleware management are handled with dotenv, CORS, and cookie-parser. Deployment is done via Railway for the backend and EAS Build for Expo-based mobile builds. The full codebase is open-source and hosted on GitHub. All UI/UX designs were created from scratch by the developer using Figma.
<br/>
![etki-methods](https://github.com/user-attachments/assets/852968e1-0a82-4542-8ef2-635735891773)


### CONCLUSION
Etki is a mobile-first event management platform that allows users to create and join events, communicate through real-time messaging, and build social connections. It supports the full event lifecycle—from creation to participation while offering privacy controls and social features like friendship management. All UI/UX components were designed and implemented by <b>Batuhan Öztürk</b> to ensure a consistent user experience. With a scalable backend and responsive mobile interface, Etki provides a solid foundation for future features such as push notifications, calendar integration, analytics, and premium memberships. The project is deployed on Railway and publicly available as an open-source repository on GitHub, demonstrating its readiness for real-world use and continued development.

#### Resources & Links 
<p> ● Full-Open Source Project GitHub Repository: https://github.com/fbatuhanr/Etki </p>
<p> ● Live Backend Server: https://etki-production.up.railway.app </p>
<p> ● Figma Design: https://www.figma.com/design/qOadmYvuSzutBmPzsoIwpz/Etki?node-id=0-1&p=f&t=nIYDNBXD2W6grs7s-0 </p>
