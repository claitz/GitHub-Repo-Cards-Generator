# GitHub Repo Card Generator

This application generates SVG cards for GitHub repositories.  
It caches data for a specific period of time to reduce the number of API requests and improve performance.  
The application also provides a user interface for generating and customizing SVG cards.

## Features

- Generates SVG cards for GitHub repositories
- Caches repository data
- Limits API requests rate
- Provides a user interface for generating and customizing SVG cards
- Provides quick copy codes (BBCode, HTML, Markdown) for embedding SVG cards

## Setup

1. Clone the repository

```bash
git clone https://github.com/yourusername/github-repo-card-generator.git
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file in the root directory and add your GitHub token:

```
GITHUB_TOKEN=your_github_token
```

4. Start the server

```bash
npm start
```

The server will start running at `http://localhost:3000`.

## Usage

Navigate to `http://localhost:3000` in your web browser.  
Enter the GitHub username and repository name in the provided fields, customize the card colors if desired, and click "Generate" to generate an SVG card for the repository.

The generated SVG card will be displayed along with BBCode, HTML, and Markdown quick copy codes for embedding the card.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)