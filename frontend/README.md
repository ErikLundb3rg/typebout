
## Frontend 
The frontend for TypeBout is written in Typescript and uses [Next.js](https://nextjs.org/docs) 13 and Chakra-ui.

Right now it is using the experimental `/app` directory which is part of Next js 13. This is not covered by semantic versioning and might be a little unstable.

It was not necessarily the wisest of choices to use the `/app` directory, and it might be necessary to revert to the `/pages` folder structure. 
## Development
To run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

and open [localhost:3000](http://localhost:3000) to see your changes.

Note that you need to have the backend server running in order to properly play the game.