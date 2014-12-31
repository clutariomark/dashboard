This is an application for PAGASA showing a general overview of the different status of location based on the ff:

1. **Public Storm Signal**
2. **Gale Warning**
3. **Rainfall**
4. **Flooding**
5. **Landslide**
6. **Storm Surge**
7. **Others**

##**General Format of Payloads**##

##As JSON##
```
#!javascript
{
	"region":"Region VI", //required
	"province":"Antique", //required
	"location":"All Cities and Municipalities", //required
	"value":"", //optional
	"unit":"", //optional
	"description":"high risk" //required
},
{	"region":"NCR", //required
	"province":"Metropolitan Manila", //required
	"location":"Kalookan City", //required
	"value":"", //optional
	"unit":"", //optional
	"description":"high risk" //required
}

```

##As CSV##

There should be 6 columns. Just skip the column if there are no values.

```
NCR,Metropolitan Manila,Kalookan City,,,high risk
NCR,Metropolitan Manila,Las Piñas,,,high risk
NCR,Metropolitan Manila,Makati City,,,high risk
Region VI,Antique,All Cities and Municipalities,30 - 60,kph,signal #1
Region VI,Guimaras,All Cities and Municipalities,61 - 100,kph,signal #2
Region VI,Iloilo,All Cities and Municipalities,30 - 60,kph,signal #1

```