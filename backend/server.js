const app = require('./app');
const PORT = process.env.PORT || 8000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});