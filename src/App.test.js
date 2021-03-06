//src App.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

test('Add recipe button toggles visibility of a form on the page ', () => {

  render(<App />);
  // `queryBy...` methods will return null if the element is not found:
  const recipeForm = screen.queryByText("Instructions:");

  // `getBy...` methods will "throw" an error if the element is not found:
  // const recipeForm = screen.getByText("Instructions:");

  expect(recipeForm).toBeNull();
  userEvent.click(screen.getByText("Add Recipe"));

  expect(screen.getByLabelText("Instructions:")).toBeInTheDocument();
});

test('typing in the recipe name makes the recipe name appear in the input', async () => {
  render(<App />);

  const recipeName = 'No pockets';
  userEvent.click(screen.getByText("Add Recipe"));
  await userEvent.type(screen.getByLabelText('Recipe name:'), recipeName);

  expect(screen.getByLabelText('Recipe name:').value).toEqual(recipeName);
})

const setup = () => {
  const app = render(<App />);

  userEvent.click(app.getByText('Add Recipe'));

  const submitButton = app.getByRole('button')
  const instructionsInput1 = app.getByLabelText('Instructions:')
  const instructionsInput2 = app.getByLabelText('Instructions:')
  const nameInput1 = app.getByLabelText('Recipe name:')
  const nameInput2 = app.getByLabelText('Recipe name:')
  return {
    instructionsInput1,
    instructionsInput2,
    nameInput1,
    nameInput2,
    submitButton
  }
}

test('typing in the recipe instructions makes the instructions appear in the form', async () => {
  const {instructionsInput1} = setup();

  const recipeInstructions = "kinda hard to write instructions without knowing what I'm cooking"

  await userEvent.type(instructionsInput1, recipeInstructions)
  expect(instructionsInput1.value).toEqual(recipeInstructions);
})

test('recipe name from state appears in an unordered list', async () => {
  const {instructionsInput1, nameInput1, submitButton} = setup();
  const recipeName1 = "Lean Pockets"
  const recipeInstructions1 = "place in toaster oven on 350 for 45 minutes"

  await userEvent.type(instructionsInput1, recipeInstructions1)
  await userEvent.type(nameInput1, recipeName1)
  userEvent.click(submitButton);

  expect(screen.getByRole('listitem')).toBeInTheDocument();
  expect(screen.getByText(recipeName1)).toBeInTheDocument();
})

test('multiple recipes will be displayed once they are added', async () => {
  const {instructionsInput1, nameInput1, instructionsInput2, nameInput2, submitButton} = setup();
  const recipeName1 = "Lean Pockets"
  const recipeInstructions1 = "place in toaster oven on 350 for 45 minutes"
  const recipeName2 = "Heavy Pockets"
  const recipeInstructions2 = "place in toaster oven on 400 for 30 minutes"

  await userEvent.type(instructionsInput1, recipeInstructions1)
  await userEvent.type(nameInput1, recipeName1)
  userEvent.click(submitButton);
  await userEvent.type(instructionsInput2, recipeInstructions2)
  await userEvent.type(nameInput2, recipeName2)
  userEvent.click(submitButton);

  expect(screen.getByRole('listitem')).toBeInTheDocument();
  expect(screen.getByText(recipeName1)).toBeInTheDocument();
  expect(screen.getByText(recipeName2)).toBeInTheDocument();
})