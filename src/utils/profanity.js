
const badWords = [
    "fuck", "fucking", "fucker", "motherfucker", "shit", "bullshit",
    "bitch", "sonofabitch", "bitches",
    "ass", "asses", "asshole", "arsehole",
    "cunt", "twat", "prick", "dick", "dicks", "dickhead",
    "pussy", "slag", "slut", "whore", "hoe",
    "bastard", "wanker", "tosser",
    "crap", "damn", "goddamn", "hell",
    "nigga", "nigger", "chink", "spic", "kike", 
    "retard", "retarded", "moron", "idiot", "balls"
  ];
  
  

  export const isProfane = (text) => {
   
    const lowerCaseText = text.toLowerCase();
    

    return badWords.some(word => lowerCaseText.includes(word));
  };