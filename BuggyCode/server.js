const express = require("express");
const app = express();

app.use(express.json());

const users = [
    { id: 1, name: "Amit", email: "amit@test.com" },
    { id: 2, name: "Riya", email: "riya@test.com" }
];

const notes = [
    { id: 1, title: "Note 1", content: "Content 1", userId: 1 },
    { id: 2, title: "Note 2", content: "Content 2", userId: 2 }
];

app.get("/users", (req, res) => {
    const allUsers = users;
    //res.send(userList); // Bug: here userList is not defined
    res.send(allUsers); // Fixed
});

app.get("/users/:id", (req, res) => {
    //const id = req.params.id; // Bug: here req.params.id is string but in users id is number, we need number to compare
    const id = Number(req.params.id); // Fixed
    const user = users.find(u => u.id === id);
    res.send(user);
});

function getUserById(id) {
    //   const user = users.find(u => u.id === id); // Bug: function never return anything 
    return users.find(u => u.id === id); // Fixed
}

app.get("/notes/count", (req, res) => {
    //  const total = notes.lenght; // Bug: Spelling mistake
    const total = notes.length; // Fixed
    res.send({ total });
});

app.get("/external-data", async (req, res) => {
    //   const data = fetchExternalData(); //Bug: fetchExternalData() is asynchronous function bt called without await
    const data = await fetchExternalData() // Fixed
    res.send(data);
});

app.get("/notes", (req, res) => {
    //  if (notes = []) {  // Bug: using Assignment operator instead of comparison
    if (notes.length == 0) {
        console.log("No notes found");
    }
    res.send(notes);
});

function generateNoteId() {
    //   return Math.random() * 1000; // Bug: In big Application it can create duplicate ids
    return Date.now(); // Fixed
}


// const newId = generateNoteId; // Bug : we are not calling this function

app.post("/notes", (req, res) => {
    const { title, content, userId } = req.body;

    //   if (!title && !content) { // Bug: it failed when both are missing 
    //     return res.send("Invalid input");
    //   }

    if (!title || !content) { // Fixed: it failed when one of the field is missing 
        return res.send("Invalid input");
    }

    const newNote = {
        id: generateNoteId(), // Fixed: we call it directly here for better understanding and approach 
        title: title,
        content: content,
        userId: userId
    };

    notes.push(newNote);
    res.send(newNote);
});


app.delete("/notes/:id", (req, res) => {
    //   const id = req.params.id; // req.params.id is string,  we need number to compare
    const id = Number(req.params.id); // Fixed
    const noteIndex = notes.findIndex(n => n.id === id);

    // notes.splice(noteIndex, 1); // Bug: if the note not found it will delete last note
    // Fixed with Better Approach: it can give proper msg that note is not found 
    if (noteIndex === -1) {
        return res.status(404).send({
            message: "Note not found"
        });
    }
    res.send({ message: "Note deleted" });
});


app.put("/users/:id", (req, res) => {
    //   const id = req.params.id; req.params.id is string, we need number to compare
    const id = Number(req.params.id); // Fixed
    const { name } = req.body;

    const user = users.find(u => u.id == id);

    // we can check here if the user is exist or not,  better error handling 
    if (!user) {
        return res.status(404).send({
            message: "User not found"
        });
    }

    //   user.name = username; // Bug : username is not exist 
    user.name = name; // Fixed  

    res.send(user);
});

app.get("/user-notes/:userId", (req, res) => {
    // const userId = req.params.userId; // Bug:req.params.userId is String  we need number to compare
    // const userNotes = notes.filter(n => n.userId = userId); // Bug: used assignment operator instead of Comparison op.
    
    const userId = Number(req.params.userId); // Fixed
    const userNotes = notes.filter(n => n.userId == userId); // Fixed
    res.send(userNotes);
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;

    // if (email === "admin@test.com" || password === "123456") { // Bug: we can not use OR operator here major security issue 

    if (email === "admin@test.com" && password === "123456") { // Fixed: used AND both should be true  
        res.send({ message: "Login successful" });
    } else {
        res.send({ message: "Invalid credentials" });
    }
});

app.get("/profile/:id", (req, res) => {
    const id = Number(req.params.id);

    // const user = users.filter(u => u.id === id); // Bug: Filter return array and we are doing user.name in next line
     const user = users.find(u => u.id === id); // Fixed : user "find" go the user it return only first one matching record

    res.send(user.name);
});

app.post("/sum", (req, res) => {
    const { a, b } = req.body; 
    // const total = a + b; //Bug : what is both are string it concated i.e 5 + 5 = 55
    const total = Number(a) + Number(b); // Fixed: Convert to Number
    res.send({ total });
});

app.listen(3000, () => {
    // console.log("Server running on port 5000"); // Bug : Listing on 3000 but logging on 5000 
    console.log("Server running on port 3000"); // Fixed
});