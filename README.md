Commander Periscope
===================

## Setup

**Prerequisite:** You will need to have [yarn](https://yarnpkg.com/en/docs/install) installed.

```$bash
git clone https://github.com/simonbw/commander-periscope
cd commander-periscope
yarn
yarn start
```

## Contributing

There are plenty of TODOs in the code.
Feel free to grab one and start working on it.

## Bigger Todos
Some bigger things that need to be done:
 
 - Take these TODOs and ones in the code and turn them into more fleshed out issues.
 - Take a bunch of the strings that are scattered throughout the code and put them into constants. Any that are shared between client and server code should go in the `common` folder.
 - Deal with changing the URL correctly.
 - Make it look good. Basically all the pages look like garbage right now.
 - Come up with good logging to be able to replay games easily
 - Set up react storybook to make developing components easier
 - Come up with some sort of strategy for dealing with pending and failed actions.
 - Come up with an idea for what the radio operator's interface could look like.
 - Try to send less information over the wire. We don't need to send everyone their full game state on every action.
 - Enforce some stricter style standards. Be consistent with the type of function declaration we're using.
 - Do a security audit. We shouldn't expose people's user ids.
 - Do a pass to simplify the architecture where possible. There are probably some things that are overengineered,
   and there are probably some things that are redundant.
 - Maybe use typescript or at least add proptypes to components.
 - Do an accessibility passover. Pay attention to colorblindness.
 - Support Hot Module Replacement correctly
   
### Security Roadmap

There are things we need to do to prevent cheating.

 - Don't give out userids to other players. Consider using a hash, or only identifying other players by role or username.
 - Don't send updates when a player hasn't received new information. This can give away information that something just happened.