# Contributing to Bloguer

We welcome contributions to **Bloguer** and appreciate the effort made by every contributor. If you're interested in improving the project, here's how you can get involved:

## Table of Contents
- [How to Contribute](#how-to-contribute)
- [Contributing Guidelines](#contributing-guidelines)
- [Suggested Contributions](#suggested-contributions)
- [Code of Conduct](#code-of-conduct)

---

## How to Contribute

### Fork the Repository
1. Fork the repository by clicking the "Fork" button on the [Bloguer GitHub page](https://github.com/pulkitgarg04/Bloguer).
2. Clone your forked repository to your local machine:
   ```bash
   git clone https://github.com/<your-username>/Bloguer.git
   cd Bloguer
   ```

### Set Up Your Development Environment

#### For the Client (Frontend)
1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

#### For the Server (Backend)
1. Open a new terminal and navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in your `wrangler.toml` file.
4. Start the backend server:
   ```bash
   npm run dev
   ```

### Create a New Branch
1. Create a new branch to work on your feature or fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

### Make Changes
- Write your code and make sure it adheres to the coding standards of this project.
- Test your changes locally and ensure everything works as expected.

### Commit and Push Changes
1. Add your changes:
   ```bash
   git add .
   ```
2. Commit your changes with a clear and descriptive message:
   ```bash
   git commit -m "Add your commit message here"
   ```
3. Push your changes:
   ```bash
   git push origin feature/your-feature-name
   ```

### Open a Pull Request
- Open a pull request to the `main` branch of this repository. Provide a clear description of the changes you’ve made and any additional information.

---

## Contributing Guidelines

### Code Standards
- Follow best practices for writing clean, readable, and maintainable code.
- Use **ESLint** and **Prettier** to ensure consistent code formatting. The project includes configuration files for these tools.

### Commit Messages
- Write **clear** and **concise** commit messages. Follow the [Conventional Commits](https://www.conventionalcommits.org/) style guide if possible.

### Pull Request Reviews
- Be open to feedback and make requested changes before merging your pull request.

---

## Suggested Contributions

We appreciate contributions in the following areas:

- **Bug Fixes**: Help fix any issues found in the project. Check the [open issues](https://github.com/pulkitgarg04/Bloguer/issues) for details.
- **Features**: Add new features to enhance the functionality of Bloguer.
  - For example, new payment integrations, analytics, or notification features.
- **UI/UX Enhancements**: Improve the user interface, accessibility, and design.
- **Documentation**: Help improve the documentation by fixing typos, improving readability, or adding missing information.

---

## Code of Conduct

Please be respectful and follow the [Code of Conduct](https://www.contributor-covenant.org/version/2/0/code_of_conduct/) while contributing to this project.

---

Thank you for contributing to Bloguer! Your help is truly appreciated!