// src/api/mockApi.js

const CHECKPOINTS = [
  {
    id: 'CP01',
    name: "The Pragmatist",
    solution: "8675",
    location: { lat: 13.009561060347373,  lng:   74.7953531520573, },
    mapCoords: { x: '51%', y: '47%' },
    clue : "Where metal bends but minds grow strong, Gears and tools hum all day long.", 
    suspect: {
      id: 'evelyn', 
      name: 'Dr. Evelyn Reed',
      profile: "As the tenured chair of the university's Ethics committee, Dr. Reed is a pragmatist who viewed Thorne's unchecked ambition as a direct threat. She believed the Chimera was dangerously unstable and had formally tried to shut the project down, but was overruled."
    },
    clue1: "Forensic Accounting Flag: A money trail confirms substantial, recurring payments from Novaterra Fuels directly to Dr. Reed. The transactions are thinly veiled as 'research grants.' This provides a powerful financial motive for her to sabotage a rival green energy project. KR1 - D9",
    clue2: "A draft grant proposal found on her laptop outlines how she was planning to co-lead future research with Thorne. Killing him would only jeopardize her chance at securing funding. KR4 - D6"
  },
  {
    id: 'CP02',
    name: "The Protege",
    solution: "23f68",
    location: { lat: 13.009331696808724,   lng: 74.79574147840232 },
    mapCoords: { x: '55%', y: '40%' },
    clue : "See ahead, search far. See behind, in a world apart. See in between, where the currents spark. Seek near and far in the tides of time, The high seas, the low seas and the seas.", 
    suspect: {
      id: 'kae', 
      name: 'Kaelen Reyes',
      profile: "Dr. Thorne's brilliant and ambitious PhD student. As the lead programmer for the Chimera's control software, she had unparalleled access and knowledge. Publicly, she adored her mentor, but privately she felt her contributions were being erased from the project's history."
    },
    clue1: "Recovered Data Fragment: A deep-level drive scan on Kae's workstation uncovered an encrypted, off-server backup of the entire Chimera software architecture. She was copying the project's most valuable asset, something she never disclosed to Dr. Thorne. KC1 - D5",
    clue2: "An access log shows Kae repeatedly bypassed normal lab protocols, using administrator-level overrides long after Thorne had left. The pattern doesn’t look like routine work—it looks like someone carving out a private project within Chimera. KR2 - D8 "
  },
  {
    id: 'CP03',
    name: "The Journalist",
    solution: "5815",
    location: { lat: 13.01262460151561,   lng: 74.79645222081095, },
    mapCoords: { x: '6%', y: '29%' },
    clue : "The cost of coffee, the cost of tea, Ask what you need, they'll answer with glee.", 
    suspect: {
        id: 'lila',
        name: 'Lila Moreno',
        profile: "A sharp and ambitious student reporter for the university’s independent paper. Lila had been investigating Project Chimera for weeks, determined to uncover a story that would put her on the national stage. She's known for pursuing leads relentlessly."
    },
    clue1: "From the unpublished notes of Lila Moreno: A recovered draft of her exposé contains a chilling sentence: \"Thorne's device doesn't just gather energy; it resonates with it. He called the bio-electric feedback loop 'The Echo.' He believed it could influence thought.\" KR3 - D7",
    clue2: "A half-written exposé on her laptop critiques “the commercialization of Chimera,” its draft carefully angled toward release after Thorne’s big reveal. The timing promised maximum visibility for her story. KC2 - D4"
  },
  {
    id: 'CP04',
    name: "The Estranged",
    solution: "5469",
    location: { lat: 13.009532506672716,  lng:  74.79410685244191, },
    mapCoords: { x: '53%', y: '74%' },
    clue : "Find my fourth to learn what you seek, Where doors hide knowledge for those who peek.", 
    suspect: {
      id: 'marcus', 
      name: 'Marcus Thorne',
      profile: "Aris's estranged older brother and an unassuming university librarian. A quiet academic specializing in historical cryptography, he holds a deep-seated grudge against his brother for allegedly stealing a key scientific concept from him years ago, which led to their family's financial ruin."
    },
    clue1: "Marginalia from Tesla Journal: Marcus Thorne's annotated notes in the margins of a Tesla journal are filled with rage. One note reads: \"He stole it all. The resonant frequency, the atmospheric cascade... my discovery, his legacy.\" KC4 - D2",
    clue2: "Hidden in the Tesla journal scan is a rough schematic with Marcus’s initials scrawled beside it. The drawing mirrors a key element of Chimera’s core design. SDA - A4"
  },
  {
    id: 'CP05',
    name: "The Investor",
    solution: "1888",
    location: { lat: 13.009129180664573,   lng: 74.79661463302433, },
    mapCoords: { x: '57%', y: '27%' },
    clue : "Turn around, touch the ground. The wheels of the magic round. At the stop where waiting's found.", 
    suspect: {
      id: 'julian', 
      name: 'Julian Croft',
      profile: "A ruthless venture capitalist whose firm, 'Croft Innovations,' is on the verge of bankruptcy. The multi-million dollar exclusivity deal for the Chimera was his last hope. He's known for his aggressive tactics and a history of high-stakes corporate gambles."
    },
    clue1: "SEC Filing Analysis: Financial records confirm Croft Innovations is leveraged to the breaking point. A leaked audio file captures him stating he would \"do anything\" to secure the Chimera IP. With Thorne dead, the 'key person' clause in his contract is void, putting the project's ownership in chaos. KC3 - D3",
    clue2: "A draft letter to Croft’s creditors reveals he promised to resolve his company’s mounting debts by “securing exclusive rights to Chimera.”"
  },
  {
    id: 'CP06',
    name: "The Rival",
    solution: "4747",
    location: { lat: 13.00984604836314,  lng:  74.79841098737691, },
    mapCoords: { x: '45%', y: '7%' },
    clue : "A home for games beneath one dome, Where sweat and cheers make champions roam.", 
    suspect: {
        id: 'veyra',
        name: 'Prof. Alan Veyra',
        profile: "A respected electrodynamics researcher whose career was derailed when his department’s funding was diverted to support Thorne’s Chimera project. Once considered a rising star, Veyra became increasingly bitter as his own work was overshadowed and dismissed. SCL - A5"
    },
    clue1: "Recovered Lab Note Fragment: A partially destroyed letter, hidden within Veyra's old research notes, reads: \"...he is a parasite who calls it progress. He didn't just take my funding; he buried my work. A world built by Aris Thorne is one that deserves to burn.\"",
    clue2: "Veyra’s notes show his projects often lagged behind or referenced Thorne’s work. For all his anger, his research still relied on Thorne’s progress."
  },
  {
    id: 'CP07',
    name: "The Administrator",
    solution: "1427",
    location: { lat: 13.01061113235006,   lng: 74.79588806317606, },
    mapCoords: { x: '35%', y: '35%' },
    clue : "The light falters but the stage endures, a witness to all that time ensures.", 
    suspect: {
        id: 'halstrom',
        name: 'Dean Halstrom',
        profile: "The university’s polished dean of engineering with clear political ambitions. He saw Chimera as the crown jewel to secure massive funding and global recognition for the university, and was willing to overlook ethical lines to achieve that goal."
    },
    clue1: "Leaked Internal Memo: An anonymous tip provided a copy of Dean Halstrom's calendar, showing a confirmed meeting with a Department of Defense liaison. The agenda item was \"Chimera 'Echo' Applicability.\"",
    clue2: "Draft budget records reveal Halstrom had already earmarked funds for a new “campus innovation center,” a civilian façade for military-funded work, with Chimera positioned as its crown jewel."
  },
  {
    id: 'CP08',
    name: "The Ghost",
    solution: "1138",
    location: { lat: 13.011186106482821,  lng: 74.79384621275285,},
    mapCoords: { x: '27%', y: '74%' },
    clue : "Back and forth I trace the hours, A pendulum's dance through sun and showers. Like a metronome I sway in time, Measuring days in a worthless chime. ", 
    suspect: {
        id: 'nyx',
        name: 'Nyx',
        profile: "A digital phantom and notorious dark-web data broker known for stealing high-value tech IP. Security logs show their digital signature 'pinging' the university network on the night of the murder. Their motives are purely professional and their identity is a complete unknown."
    },
    clue1: "Decrypted Data Cache: A file recovered from the server room contains a list of potential buyers for high-tech IP on the black market, including foreign defense contractors and tech corporations. 'Project Chimera' is at the top of the list with a multi-million dollar valuation.",
    clue2: "Server logs show Nyx was siphoning massive chunks of Chimera’s encrypted archives the night Thorne died. The files were layered with Thorne’s personal cipher — impossible to decode."
  }
];

const CORRECT_KILLER = 'kae';

// This function simulates fetching data from a server.
export const fetchGameData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Automatically create a unique list of all suspects from the checkpoints
      const uniqueSuspects = [...new Map(CHECKPOINTS.map(cp => [cp.suspect.id, cp.suspect])).values()];
      resolve({ checkpoints: CHECKPOINTS, suspects: uniqueSuspects });
    }, 500); // Simulate a network delay
  });
};

// This function simulates checking a submitted code.
export const verifySolution = (checkpointId, submission) => {
    return new Promise((resolve, reject) => {
        const checkpoint = CHECKPOINTS.find(c => c.id === checkpointId);
        if (checkpoint && checkpoint.solution === submission) {
            resolve({ correct: true });
        } else {
            reject({ correct: false, message: "Incorrect code. The data remains locked." });
        }
    });
};

// This function simulates checking a final accusation.
export const verifyAccusation = (suspectId) => {
    return new Promise((resolve) => {
        resolve(suspectId === CORRECT_KILLER);
    });
};