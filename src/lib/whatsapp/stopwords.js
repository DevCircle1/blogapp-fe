/**
 * Words that dominate any chat and say nothing about it. English, the most common
 * chat fillers, and everyday Roman-Urdu/Hindi words (a great deal of chat in South
 * Asia is written that way). Other languages are counted unfiltered.
 */
const ENGLISH = 'a about after again all also am an and any are aren\'t as at be because been before being but by can can\'t cannot could couldn\'t did didn\'t do does doesn\'t doing don\'t down for from get got had hadn\'t has hasn\'t have haven\'t having he her here hers him his how i i\'d i\'ll i\'m i\'ve if in into is isn\'t it it\'s its just let me more most my no nor not now of off on once one only or other our out over own same she should so some such than that that\'s the their them then there these they this those through to too under until up us very was wasn\'t we were what when where which while who whom why will with won\'t would you you\'re your yours yourself yeah yes ok okay lol haha hahaha hmm oh im dont cant ill ive thats its u ur r k gonna wanna gotta really actually like also still even much well going go know see think want need make good one two';

const CHAT = 'media omitted image video audio sticker gif document deleted message edited https http www com null';

const ROMAN_URDU = 'hai hain hy h nahi nahin nhi nai kya kia kyun kyu ko ka ki ke se sy main mein me mai aur or bhi bhe tu tum tumhe ap aap apka hum ham mera meri mere tera teri tere ye yeh wo woh ho hoon hun hua hui hue tha thi the thy kar kr karo kro karna kiya kaise kese kaha kahan kab abhi bas acha accha achha theek thik yar yaar haan han ha na naa toh to koi kuch sab sirf agar lekin par pe pr per jab tab phir fir hi bilkul zaroor please plz pls mat jao jaana chalo chal raha rahi rahe rha rhi rhe wala wali wale liye lye jo jis us uska uski uske un unka unki unke is iska iski iske';

export const STOPWORDS = new Set(`${ENGLISH} ${CHAT} ${ROMAN_URDU}`.split(/\s+/).filter(Boolean));
