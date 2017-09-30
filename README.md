# game-of-life
TypeScript implementation of Conway's Game of Life

# Idea
This project was created as an entry for the [IT-Talents Code Competition "Game Of Life 2017"](https://www.it-talents.de/foerderung/code-competition/code-competition-09-2017)
by [Niklas Kühtmann](https://github.com/IZEDx).

It's aiming for simplicity in function and uses no-dependency method of just needing a browser to run, however no connection needed.

# Features
 - Simple interface
 - Supports Life 1.05 and Life 1.06 code
 - Customizable speed
 - Drawing mode by dragging objects
 - Local storage for importing objects once and always spawning them
 - Console exposed control functions (game, gameObject)

# How to run
Required files for running it:
- index.html
- dist/

Running index.html with dist/ in the same directory should do the job
except for importing objects via url. Which isn't possible with the
current interface anyway.

Serving index.html with dist/ in the same directory and access to it will work as well.
Every object that is imported into it, is stored in the LocaStorage of the Browser,
meaning the server does not need to save anything.

