import app from './configs/express';

const PORT = process.env.APP_PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
