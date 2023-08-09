# Hackbright Capstone Project

## This is an application to introduce Genetics to everybody.

## Here are the main MVP of my app:
- Users can gain fundamental knowledge of Genetics from the main page.
- Users can test their knowledge about complementary and hydrogen bonds in the assessment page. There will be 5 random strands of DNA and users must type in the corresponding complementary and number of hydrogen bonds. 10 scores for each correct answers, so the highest score will be 100.
- If users know the administrator password, they can interact with the question database. Four basis features are:
    - View all questions. Each question has 4 attributes, namely: id, strand of DNA, the coresponding complementary and number of hydrogen bonds
    - Add new question by providing a new strand of DNA.
    - Delete a question by providing its id
    - Modify a question by providing its id and a new strand of DNA

## Backend
I prepared 2 files index and controller. The controller file contain 2 groups of functions:
- Functions to generate random strands of DNA
- Functions to interact with the PostgreSQL server on Render website. Sequelize and dotenv are used to connect and send query.

## Front end
I constructed 3 views:
1. **Home** is the place user can learn new thing.
2. **Assessment** will be used to test users' knowdledge.
3. **Setting** is where admin can view the rubric or manipulate the question database. 

## Snapshot of my page
