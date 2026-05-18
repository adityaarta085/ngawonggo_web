body {
    margin: 0;
    font-family: Arial;
    background-color: #101020;
    color: white;
}

header {
    text-align: center;
    padding: 40px;
    background: #181832;
}

h1 {
    margin: 0;
    font-size: 40px;
    letter-spacing: 2px;
}

.anime-list {
    display: flex;
    justify-content: center;
    gap: 20px;
    padding: 40px;
    flex-wrap: wrap;
}

.card {
    width: 230px;
    background: #1c1c38;
    padding: 15px;
    border-radius: 15px;
    text-align: center;
    transition: .3s;
}

.card:hover {
    transform: scale(1.05);
    background: #252552;
}

.card img {
    width: 100%;
    border-radius: 10px;
}

footer {
    text-align: center;
    padding: 20px;
    background: #181832;
    margin-top: 20px;
}
