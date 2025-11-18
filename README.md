# mtm6302-capstone-rout0052
**Taro Routly**

**Student Number**: 041126214

Astronomy Picture of the Day 

*Using NASA API*

**Wireframes**: https://www.figma.com/design/di1DDwy8teNCfG5RPE7Nnw/MTM6302-APOD-Wireframes?node-id=1034212-1809&t=NahD7iymFa3Iva8A-1

---

## Report: 

#### Part 1: Setup & Initial APOD Discovery

Going into this part of the project, we had been told that the NASA APOD API was no longer working and to use the Wikimedia Commons one instead. However, as I tested both APIs I found that the NASA API worked, where the Wikimedia Commons did not. Given that the NASA one worked, as well as I had reached out to classmates to ask them and they also had similar results, I decided to move forward with NASA's APOD API as planned.

To begin the project, I first started by starting a new branch for part 4 and removing the filler content from the HTML so that it can be added dynamically with Javascript. 

I then set up the variables for HTML elements that would be needed to add the information back to the display, such as the containers that holds the pulled information, the elements where text is added or attributes are changed.

As well, I added an important variable called "displayedAPOD". This variable held the object of the APOD that was currently being displayed by the user. I set it up globally so that it could be accessed throughout the script. It is also a let variable instead of a const as it will need to be redeclared as new APODs are pulled.

<br>  

#### Part 2: Fetch & Display On Form Submission

The next step was to set up the APOD display when the form was submitted. This part involved using the Fetch API method we learned in class with an asynchronous function when the $dateSubmit button was clicked. Then, with that object updated, it adds the information from the APOD into the HTML elements. While testing this feature, I found that on some of the APODs, there was missing copyright information when pulled, even when it was on the website version of that date. So, I used an if statement to catch that, and moved on to the favourites management. 


#### Part 3: Favourites Managements
For favourites management, I knew that I would want to use an array on the script itself, and be able to pull and push that information to the local storage. I started by creating the initial array, and then made a function called updateFavourites, which overrides the local favourites array to the stored one, then displays the favourites. The displayFavourites() function used the same method as we learned in class with html templates, and adding them with inner HTML, just with the addition of removing or adding the text that tells the user to add favourites depending on if there were any entries in the favourites. 

With the initial adding of the favourites out of the way, the bigger issue came up: how to successfully add or remove favourites from the array, and how to set up conditionals to search if a favourite is in the array. Adding to the favourites itself was easy, you just pushed the displayedAPOD to the favourites array, and update the local storage. However, setting up the conditional if statement was harder, as I couldn't just search the local storage array for displayedAPOD, since it uses strict equality and the exact instance of displayedAPOD was not used there. After messing around with it for a while, I realized the easiest way to search through the arrays from local storage was to use the JSON.stringify method, as the displayedAPOD as a string WOULD match with strict equality the part of the string in local storage. With this, I was able to set up conditionals for the star icons by stringifying the local storage, and then using the includes() method to search for the displayedAPOD's date (the date is a smaller piece of data to search for if we are simply looking for a binary true false). However, removing the favourite from the array required the index number, required some more thinking.
<br>

#### Part 4: Removing Favourites Fix

After finding the fix for the favourite conditionals, I realized that using the strings for comparison worked very well and very quickly! But to remove the favourite, I needed to find the index. The indexOf method also used strict equality, so the strings would need to match, but would still need to be in an array. I then thought of the idea to use the map() method to get the local storage, parse the data into an array, then map the objects inside the array into strings, then use indexOf() on a stringified APOD you are trying to find the index of. It would then bypass strict equality as the strings would be equal! It worked really well and I was very proud of this solution.

#### Part 5: Downloading Images

In the past I had used the download attribute on a link to download an image, and had thought the process would be similar in this project. However,  I had not remembered that that only works on locally stored files. Researching this topic more, I learned that to get around this you use the blob() function and several other steps to download the file. Given the time crunch and my current ability level, I was not able to accomplish this in the time we had to complete this assignment. Since this was an extra part that was not part of the requirements, I stuck with the link just to open the image for the user to download themselves. In the future, I want to come back to this project and add this functionality in.