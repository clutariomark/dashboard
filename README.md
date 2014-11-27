This is an application for PAGASA showing a general overview of the different status of location based on the ff:

1. **Strong Rains**
2. **High Winds**
3. **Flooding**
4. **Landslide**
5. **Storm Surge**

##**General Format of Payloads**##

##As JSON##
```
#!javascript
{
    "id" : 1, //optional but good to have
    "location" : "Pasig City", //required
    "location_id" : 19, //required
    "value" : 778, //required
    "unit" : "mm Hg", //optional
    "description" : "Normal Value" //required
},
{
    "id" : 2, //optional but good to have
    "location" : "Quezon City", //required
    "location_id" : 20, //required
    "value" : 778, //required
    "unit" : "mm Hg", //optional
    "description" : "Normal Value" //required
},

```

##As CSV##

There should be 6 columns. Just skip the column if there are no values.

```
1,Pasig City,19,778,mm Hg,Normal Value  
2,Quezon City,20,778,mm Hg,Normal Value

```

