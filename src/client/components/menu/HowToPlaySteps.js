import React from 'react';

// this is in a separate file because for some reason it makes Webstorm really slow

export default [
  (
    <div>
      <h3>Summary</h3>
      <p>
        In Commander Periscope, your objective is simple: <i>destroy the enemy before they destroy you</i>.
      </p>
      <p>
        Each member of your 4-person crew will perform specific tasks to hunt your enemy while keeping your sub
        operational.
      </p>
    </div>
  ), (
    <div>
      <h3>Captain</h3>
      <p>
        The Captain's job is to decide where to go and what systems to use.
      </p>
      <p>
        <strong>Torpedo: </strong>
        Your primary weapon. Two direct hits or four indirect hits will sink your enemy.
      </p>
      <p>
        <strong>Mine: </strong>
        Drop a mine, then detonate it when you think your enemy is near.
      </p>
      <p>
        <strong>Drone: </strong>
        Send a drone to a sector to find out whether or not your enemy is there.
      </p>
      <p><strong>Sonar: </strong>
        Give's the radio operator some information about the enemy's location.
      </p>
      <p>
        <strong> Silent: </strong>
        Make a move without alerting your opponent's radio operator.
      </p>
      <p>
        <strong>Surface: </strong>
        Clears your path and fixes all broken subsystems, but halts all actions for 30 seconds and alerts the enemy to
        what sector you're in.
      </p>
    </div>
  ), (
    <div>
      <h3>First Mate</h3>
      <p>
        The First Mate's job is to charge your systems.
        Every time the Captain decides to move, you can choose one system to charge.
        The systems can only be used once they are fully charged.
      </p>
    </div>
  ), (
    <div>
      <h3>Engineer</h3>
      <p>
        Every time the captain decides to move the ship, you must choose a subsystem to power down.
        When all of the subsytems on a circuit are powered down, you replace the whole circuit and all the subsystems on
        it come back online.
      </p>
    </div>
  ), (
    <div>
      <h3>Radio Operator</h3>
      <p>
        The Radio Operator tries to calculate the enemy's position by listening to a stream of commands from the enemy's
        captain.
        The Captain can get you more information by using <strong>Drones</strong> or <strong>Sonar</strong>.
      </p>
    </div>
  ), (
    <div>
      <h3>That's It!</h3>
      <p>
        All that's left is to create a lobby or join an existing one.
      </p>
    </div>
  )
];