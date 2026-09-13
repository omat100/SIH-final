### SIH-final
This has been made for SIH
all code except socket has been tested

### KOI BHI KOI MAJOR CHANGES NAAHI KAREGA
models and be trained and stored in models folder in backed and just change the path in __init__.py
rest everything is set. 

### data moves as shown in workflow folder
These are well maintained flowcharts which you can use
if anything is left out let me know
the post format can be seen in type.md

### Iske baad socket ka ek baar dekh lo
This can be been in bridge folder
As i didnt have any hardware i unfortunately could not check if hardware data goes to supabase therefore i have
drawn the flowchart of the main plan of how data shall move there

### routes package
the routes package has all the routes which are later added onto app.py

### generator package
This is the most important package in terms of generating sample data
so that testing and UI could be done on the backend and frontend as well
You can change values of course in there.
This package has also been kept as a backup if hardware fails

### models package
Ye package basically model load karke use backend ke liye available karta hai
You are not allowed to touch anyfile in there if you want at max you can try changing the model path in 
__init__.py but keep in mind to comment the model code and paste yours dont delete any model code.

### notebooks
This is basically where the model was trained and made

### src
This folder contains the bridge and routes package
the data sources file here is so that we can know frm where the data is coming
is it coming from ESP32 or from the generator function disscussed above

### .env
If you need the .env which has SUPABASE credentials toh mujhe mat puchna

### frontend 
Well there are 2 pages up there thats set and rest is just api calling
