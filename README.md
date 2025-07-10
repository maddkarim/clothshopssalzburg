Target user:
This is a web map of clothing shops in Salzburg that I created to make it easier for users to find specific types of stores — like casual, sport, designer, traditional, and more — as well as filter by category (men, women, children). Personally, I often struggle to find exactly the kind of shop I want when I visit a new city, so I thought it would be useful to build a map like this myself.

Methodology:
As a starting point, I used an example provided by our instructor, which helped me move step by step. I then expanded and modified it significantly, adding new features, customizing the design, and adapting it for my specific dataset. In addition to the instructor’s example, I also referred to widely-used coding sources like Leaflet documentation, Stack Overflow, and GitHub Gist examples, which were incredibly helpful when solving technical issues or trying to implement features like icon filters, map layer controls, or user location detection.


Data Sources:
The data was collected using Overpass Turbo and then edited manually in ArcGIS Online. This part was extremely challenging because the original dataset didn’t include key attributes like clothing types or target categories. I had to manually add and edit these fields directly in the GeoJSON file.
Writing codes in VisualStudio took a lot of time and attention, especially because I learned that even one small typo — a missing bracket or an extra comma — can break the entire map. But this application is very convenient and tells where to find the error. Sometimes, the whole map would disappear, and I had to search line by line just to find that tiny mistake.


Design Choices:
The icons used to represent clothing types were generated with the help of ChatGPT, but I carefully edited them myself — adjusting colors, scaling, shape and layout so they would look visually consistent on the map. I also made design decisions to keep the interface clean: the legend is placed on the side and works as an interactive filter, not just a static guide. I replaced the default OpenStreetMap background with CartoDB Positron for a more modern look. The search bar is positioned neatly and doesn’t overlap with zoom buttons or the legend. There’s also a button that shows the user’s current location on the map — but only when clicked.

Analysis:
One of the hardest parts was implementing the filtering system. Since many shops sell more than one type of clothing (e.g., both casual and sport), I had to write logic that checks for partial matches inside the string values. That required some custom JavaScript work to make sure filters work dynamically and markers are updated correctly.


Potential Improvements:
In the future, I’d like to add features like route directions to each shop, ratings and reviews, and maybe even multi-language support. Also, I would like to improve the map by connecting it to a real-time data source, so that new clothing stores or updates to existing ones are reflected instantly without needing to manually update the GeoJSON file. 

Key Takeaways:
Through this project, I realized how crucial precision is—every comma, bracket, and quotation mark matters, especially when working with GeoJSON and JavaScript. A single typo can break the entire map, and finding such bugs taught me a lot about patience and attention to detail. I also learned how important it is to plan the data structure and user experience from the very beginning.

In addition, I became more familiar with the basics of coding and web structure, such as understanding the roles of <body>, <p>, <script>, and other key elements in HTML and JavaScript. I discovered many useful code snippets and functions that helped me build a more interactive and user-friendly web map.

Despite the challenges, I’m very proud of the final result and hope that this map can be truly useful—not just as a school project, but as a functional tool for anyone visiting the city.

