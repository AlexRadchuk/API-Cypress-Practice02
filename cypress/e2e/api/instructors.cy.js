/// <reference types='cypress'/>

import { postRequestBody } from '../../fixtures/testData.json'

let randomInstructorsId = Math.floor(Math.random() * 4) + 1
postRequestBody.INSTRUCTOR_ID = randomInstructorsId

describe('API-Cypress Project02', () => {
  it('TASK-1: Get All Instructors', () => {
    cy.request({
      method: 'GET',
      url: `${Cypress.env('baseURLInstructors')}`,
    }).then((response) => {
      expect(response.status).to.equal(200)

      expect(response.body).to.have.length(4)
      response.body.forEach((instructor) => {
        expect(instructor).to.have.property('INSTRUCTOR_ID')
        expect(instructor).to.have.property('FULLNAME')
        expect(instructor).to.have.property('STUDENTS')
        expect(response.body).that.is.an('array')
      })
      const expectedIds = [1, 2, 3, 4]
      const actualIds = response.body.map((instructor) => instructor.INSTRUCTOR_ID)
      expect(actualIds).to.deep.eq(expectedIds)
    })
  })

  it('TASK-2: Get A Single Instructor', () => {
    cy.request({
      method: 'GET',
      url: `${Cypress.env('baseURLInstructors')}/${randomInstructorsId}`,
    }).then((response) => {
      expect(response.status).to.equal(200)
      expect(response.body.INSTRUCTOR_ID).to.eq(randomInstructorsId)
      expect(response.body).to.have.property('FULLNAME')
      expect(response.body).to.have.property('STUDENTS')
    })
  })

  it('TASK-3:  Create a New Student and Validate the Instructor', function () {
    let studentID
    cy.request({
      method: 'POST',
      url: `${Cypress.env('baseURLStudents')}`,
      body: postRequestBody,
    }).then(function (response) {
      expect(response.status).to.equal(201)
      studentID = response.body.STUDENT_ID
      cy.wrap(response.body.STUDENT_ID).as('studentId')
    })
    cy.request({
      method: 'GET',
      url: `${Cypress.env('baseURLInstructors')}/${postRequestBody.INSTRUCTOR_ID}`,
    }).then(function (response) {
      expect(response.status).to.equal(200)
      const students = response.body.STUDENTS
      const studentExists = students.some((student) => student.STUDENT_ID === studentID)

      expect(studentExists).to.be.true

      cy.log(`Student ID ${studentID}`)
    })
    cy.log(`Student ID ${studentID}`)
    cy.get('@studentId').then((studentID) => {
      cy.request({
        method: 'DELETE',
        url: `${Cypress.env('baseURLStudents')}/${studentID}`,
      }).then((response) => {
        expect(response.status).to.equal(204)
      })
    })
  })
})
