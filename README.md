# ⚡ Turborepo Electron Starter

This is a boilerplate project that allows you to build an electron app through [turborepo](https://turbo.build/repo).

## 📚 Used Libraries

- [Electron](https://www.electronjs.org/)
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [NestJS](https://nestjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [GraphQL](https://graphql.org/)
- [Apollo](https://www.apollographql.com/)

## 🦁 NestJS as Main Process

This project uses [NestJS](https://nestjs.com/) as the main process. NestJS is a great framework for building
server-side applications with TypeScript. It has a great dependency injection system and a great module system that
allows you to easily build a modular application. so now you will not get headache with writing code for main process
logics and managing its lifecycle anymore.

## 📡 IPC over GraphQL

Have you ever written code for IPC between the main process and the renderer process? if so, you may have experienced
problems such as lack of type safety, and testability. since there is literally no way to ensure that the arguments and
return values of the IPC commands are correct.

so this project uses GraphQL for IPC between the main process and the renderer process. with this approach, you can easily
call a command from the renderer process to the main process with strongly typed arguments and return values.

and this project will not expose the GraphQL server to the outside world. it will only be used for IPC between the main
process and the renderer process. this can achieve the same level of security as IPC using `ipcRenderer` and `ipcMain`.

## 🌳 Project Structure

```
├── apps
│   ├── electron # <- this will package and build, and run the electron app
│   ├── main # <- electron main process source codes
│   └── renderer # <- renderer web app source codes
├── packages
│   ├── eslint-config-custom # <- shared eslint config
│   ├── tsconfig # <- shared tsconfig
│   ├── types # <- common types for the whole project
│   └── ui # <- shared ui components
```
