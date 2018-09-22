"use strict";

function TriviaService($http) {
  const vm = this;

  vm.easyQuestions = [];
  vm.mediumQuestions = [];
  vm.hardQuestions = [];

  vm.getEasyQuestions = () => {
    return $http({
      method: "GET",
      url: "https://opentdb.com/api.php?amount=10&category=20&difficulty=easy&type=multiple"
    }).then(response => {
      for (let i = 0; i < response.data.results.length; i++) {
        vm.easyQuestions.push({
          question: response.data.results[i].question.replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&amp;/g, "&"),
          correct_answer: response.data.results[i].correct_answer,
          incorrect_answers: response.data.results[i].incorrect_answers
        });
      }
      return vm.easyQuestions;
    });
  }

  vm.getMediumQuestions = () => {
    return $http({
      method: "GET",
      url: "https://opentdb.com/api.php?amount=10&category=20&difficulty=medium&type=multiple"
    }).then(response => {
      for (let i = 0; i < response.data.results.length; i++) {
        vm.mediumQuestions.push({
          question: response.data.results[i].question.replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&amp;/g, "&"),
          correct_answer: response.data.results[i].correct_answer,
          incorrect_answers: response.data.results[i].incorrect_answers
        });
      }
      return vm.mediumQuestions;
    });
  }

  vm.getHardQuestions = () => {
    return $http({
      method: "GET",
      url: "https://opentdb.com/api.php?amount=7&category=20&difficulty=hard&type=multiple"
    }).then(response => {
      for (let i = 0; i < response.data.results.length; i++) {
        vm.hardQuestions.push({
          question: response.data.results[i].question.replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&amp;/g, "&"),
          correct_answer: response.data.results[i].correct_answer,
          incorrect_answers: response.data.results[i].incorrect_answers
        });
      }
      return vm.hardQuestions;
    });
  }
}
angular.module("app").service("TriviaService", TriviaService);