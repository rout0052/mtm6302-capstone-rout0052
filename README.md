# mtm6302-capstone-rout0052
Taro Routly
Student Number: 041126214
Astronomy Picture of the Day 
Using NASA API

Wireframes: https://www.figma.com/design/di1DDwy8teNCfG5RPE7Nnw/MTM6302-APOD-Wireframes?node-id=1034212-1809&t=NahD7iymFa3Iva8A-1

Steps Taken To Create The Prototype:
I started off by making the general structure of the site, the header, the footer, and the main divs and adding Bootstrap, icons, fonts, and links to my other files and adding my images. I also added a dynamic favicon to change based on the users browser settings.

Then, I started building the site's content using Bootstrap classes mostly for styling. I tried to use as much of Bootstrap's built in styling as possible to practice and test my knowledge of the system. 

The main challenges I faced while working on this project were in solving how to use text-truncation, and modifying the input to fit my needs. 

Firstly, the text truncation was something I did on my prototype but had not done before in CSS, but I had found that Bootstrap had a text-truncate class. However, their text truncation is for single lines, and I wanted to show multiple lines. I did some research, and using the link below was able to implement this into my design using -webkit properties.

My other issue was the inputs I had in my wireframe, I realized when implementing them, that there is an input type specifically for dates that would work far better for this than text or number inputs. However, I wanted to make sure I really understood how to use it, and that it would fit the needs of my project. I jumped into the Date() function in Javascript, using the documentation from the IMDAC (for later in the semester), as well as the MDN Developer site to learn how to use it. I was able to make it successfully take the user's date, and have that as the last possible date to submit, as well as be the default value

Looking forward to adding the JS functionality to this site!

Bootstrap example I used for the favourites card: https://getbootstrap.com/docs/4.0/examples/album/
Text-Truncation Resource: https://www.geeksforgeeks.org/css/set-the-limit-of-text-length-to-n-lines-using-css/
MDN Date() Resource: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date