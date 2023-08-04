const inquirer = require('inquirer');
require('colors');

const questions = [{
  type: 'list',
  name: 'option',
  message: 'What would you like to do?',
  choices: [
    { value: 1, name: `${'1.'.green} Search` },
    { value: 2, name: `${'2.'.green} Search History` },
    { value: 0, name: `${'0.'.green} Exit\n` },
  ]
}];

const inquirerMenu = async () => {

  console.clear();
  console.log('=================='.green);
  console.log(' Select an option'.green);
  console.log('=================='.green);
  const { option } = await inquirer.prompt(questions);
  return option;

}

const pause = async () => {

  console.log('\n');
  const questions = [{ type: 'input', name: 'input', message: `Press ${'ENTER'.green} to continue.` }];
  const input = await inquirer.prompt(questions);
  return input;

}

const readInput = async (message) => {

  const question = [{
    type: 'input',
    name: 'desc',
    message,
    validate(value) {
      if (value.trim().length == 0) {
        return 'Please type in a value.'
      }
      return true;
    }
  }];

  const { desc } = await inquirer.prompt(question);
  return desc;

}

const listPlaces = async (places = []) => {

  const choices = places.map(({ id, name, lng, lat }, i) => {
    const index = `${i + 1}.`.green;
    return {
      value: id,
      name: `${index} ${name}`
    };

  });

  choices.unshift({
    value: '0',
    name: '0. '.green + 'Return',
  });

  const questions = [
    { type: 'list', name: 'id', message: 'Select Place', choices }
  ];
  const { id } = await inquirer.prompt(questions);
  return id;

}

const confirmDelete = async (message) => {

  const question = [
    { type: 'confirm', name: 'ok', message }
  ];
  const { ok } = await inquirer.prompt(question);
  return ok;

}

const checkListTasks = async (tasks = []) => {

  const choices = tasks.map(({ id, desc, completedOn }, i) => {
    const index = `${i + 1}.`.green;
    return {
      value: id,
      name: `${index} ${desc}`,
      checked: completedOn ? true : false
    };

  });

  const question = [
    { type: 'checkbox', name: 'ids', message: 'Select', choices }
  ];
  const { ids } = await inquirer.prompt(question);
  return ids;

}

module.exports = {
  inquirerMenu,
  pause,
  readInput,
  listPlaces,
  confirmDelete,
  checkListTasks
}