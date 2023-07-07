# GitHub Repo Card Generator

GitHub Repo Card Generator is a feature-rich application designed for effortlessly creating SVG cards that showcase GitHub repositories.

Repository cards can be generated using the user interface and entering the GitHub username and repository name.  
The card colors can be customized by clicking on the color pickers and selecting a color.

The generated SVG card will be displayed along with BBCode, HTML, and Markdown quick copy codes for embedding the card.

## Features

- Generates SVG cards for GitHub repositories
- Caches repository data
- Limits API requests rate
- Provides a user interface for generating and customizing SVG cards
- Provides quick copy codes (BBCode, HTML, Markdown) for embedding SVG cards

## Screenshots

![GitHub Repo Card Generator Interface](https://imgur.com/bmNbwdB.png)

## Examples

![GitHub Repo Card](https://ghc.clait.sh/repo/claitz/GitHub-Repo-Cards-Generator?bg_color=%23ffffff&title_color=%230366d6&text_color=%23333333&icon_color=%23333333)

![GitHub Repo Card](https://ghc.clait.sh/repo/claitz/GitHub-Repo-Cards-Generator?bg_color=%23333333&title_color=%2337ff00&text_color=%2300eeff&icon_color=%23ff00bb)

## Demo

A demo of the application is available at [https://ghc.clait.sh](https://ghc.clait.sh).  
The capacity of the demo server is limited and the caching policy aggressive, I suggest you to run your own instance of the application.

## Setup

### Local Setup

1. Clone the repository

```bash
git clone https://github.com/yourusername/github-repo-card-generator.git
```

2. Install dependencies
```bash
npm install
```

3. Rename `.env.example` in the root directory to `.env` add your GitHub token and configuration:

```makefile
GITHUB_TOKEN=your_github_token
```

4. Start the server
```bash
npm start
```

The server will start running at `http://localhost:3000`.

### Docker Setup
This application is also available as a Docker image on Docker Hub.

1. Pull the Docker image:
```bash
docker pull claitz/github-repo-card-generator
```
2. Run the Docker container, replacing `your_github_token` with your GitHub token:
```bash
docker run -p 3000:3000 -e GITHUB_TOKEN=your_github_token -e PUBLIC_URL=your_public_url claitz/github-repo-card-generator
```

3. Replace `your_public_url` with the public-facing URL (e.g., `https://example.com`).

## Usage
Navigate to `http://localhost:3000` in your web browser (or your public URL if configured).
Enter the GitHub username and repository name in the provided fields, customize the card colors if desired, and click "Generate" to generate an SVG card for the repository.

The generated SVG card will be displayed along with BBCode, HTML, and Markdown quick copy codes for embedding the card.

The repository must be public.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[Creative Commons Attribution Share Alike 4.0 International](https://choosealicense.com/licenses/cc-by-sa-4.0/)