import express from "express";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use('/node_modules', express.static('node_modules'));

const config = {
    headers: {
        'x-rapidapi-key': "39898a3126msh5eccacc949cca9ep190afcjsn4e6e49534cf6",
        'x-rapidapi-host': 'bhagavad-gita3.p.rapidapi.com'
      }
    };

    const chapterVerseCounts = {
        1: 47,
        2: 72,
        3: 43,
        4: 42,
        5: 29,
        6: 47,
        7: 30,
        8: 28,
        9: 34,
        10: 42,
        11: 55,
        12: 20,
        13: 35,
        14: 27,
        15: 20,
        16: 24,
        17: 28,
        18: 78,
    }

app.get("/", async (req, res) => {
    try {

    const randomChapter = Math.floor(Math.random() * 18) + 1;
    const maxVerse = chapterVerseCounts[randomChapter];
    const randomVerse = Math.floor(Math.random() * maxVerse) + 1;

    const apiUrl = `https://bhagavad-gita3.p.rapidapi.com/v2/chapters/${randomChapter}/verses/${randomVerse}/`;

    const response = await axios.get(apiUrl, config);

    let commentary = response.data.commentaries[15].description;

    const commentaryStartIndex = commentary.indexOf("Commentary");
    if (commentaryStartIndex > -1) {
    commentary = commentary.slice(commentaryStartIndex + "Commentary".length).trim();
    }

    res.render("index.ejs", { 
        chapterVerseCounts,
        chapterNumber: response.data.chapter_number,
        verseNumber: response.data.verse_number,
        verse: response.data.translations[0].description,
        verseCommentary: commentary,
        original: response.data.text,
     });
     console.log(response.data);
} catch (error) {
    console.error("Error:", error.message);
    res.render("index.ejs", { chapterVerseCounts, content: "Error occurred while fetching the random verse." });
}
}
);

app.post("/verse", async (req, res) => {
    try {
        const chapter = req.body.chapter;
        const verse = req.body.verse;

        const apiUrl = `https://bhagavad-gita3.p.rapidapi.com/v2/chapters/${chapter}/verses/${verse}/`;

        const response = await axios.get(apiUrl, config);

        let commentary = response.data.commentaries[15].description;

        const commentaryStartIndex = commentary.indexOf("Commentary");
        if (commentaryStartIndex > -1) {
        commentary = commentary.slice(commentaryStartIndex + "Commentary".length).trim();
        }

        res.render("index.ejs", { 
            chapterVerseCounts,
            chapterNumber: response.data.chapter_number,
            verseNumber: response.data.verse_number,
            verse: response.data.translations[0].description,
            verseCommentary: commentary,
            original: response.data.text,
        });
        console.log(response.data);
    } catch (error) {
        console.error("Error occurred:", error.message);
        if (error.response) {
            console.error("API Error Response:", error.response.data);
            res.render("index.ejs", { chapterVerseCounts, content: "Error occurred while fetching the verse." });
        } else {
            console.error("Unexpected Error:", error);
            res.render("index.ejs", { chapterVerseCounts, content: "An unexpected error occurred." });
        }
    }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});