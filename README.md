<h1 align="center">
[The Odin Project: Node] - Project: Blog API 
</h1>

<p align="center">
Made By
</p>

<p align="center">
  <a href="#">
    <img alt="Your Story" src="./src/images/sal.png" width="500" />
  </a>
</p>

## Intro

-   The repos associated with project:
    -   [User View](https://github.com/salvillalon45/theOdinProject-BlogClientUser)
    -   [Admin View](https://github.com/salvillalon45/theOdinProject-BlogClientAdmin)
-   This is the Admin View which is part of the Blog API Project. The overall project is to create an api and two clients: User View and Admin View that call the same api. The purpose is to teach us how to create apis that can serve many frontends. We had liberty of choosing how we want to do the frontend so I decided to use Gatsby and Tailwind!
-   You can find more on the project here: [The Odin Project - Blog API](https://www.theodinproject.com/paths/full-stack-javascript/courses/nodejs/lessons/blog-api)

## Overall

-   In this project I continued practicing what I did on the User View which is:

    -   Using the features of Gatsby
    -   Using ES6 features and functions
    -   Writing reusable components and JS logic
    -   Using tailwind

-   For Gatsby Features:

    -   In this project I did not create a graphql node to help me retrieve data at build time. I did this because many of the actions an admin user can take will update the data of the app. I decided to use client-side fetching to always get the most up to date data all the time
    -   There are some areas where the data was retrieved at build time. I needed to do this for the pages that were created dynamically. In Gatsby node, you can see I did two createPages and passed in the postData in the context

    ```
    // Here we are giving pages data at build time
    postsData.posts.forEach((item) => {
    	actions.createPage({
    		path: `/dashboard/blog/${item._id}/action`,
    		component: path.resolve('src/templates/action_post.js'),
    		context: { slug: item._id, postData: item, actionToTake: 'update' }
    	});
    });

    postsData.posts.forEach((item) => {
    	actions.createPage({
    		path: `/dashboard/action`,
    		component: path.resolve('src/templates/action_post.js'),
    		context: { slug: item._id, postData: item, actionToTake: 'create' }
    	});
    });
    ```

    -   I can then retrieve the data through the props. This all works because the user executes the actions in the dynamic generated page, then when they go back to the PostDetailPageContent.js or the DashboardPageContent.js there is a useEffect that executes a request to get the updated post info. This was really cool :)

-   JS Logic

    -   There were many areas of the code that were being used a lot so I practiced doing reusable functions. For example, in this function I use it everytime I am going to make a REST method. Really proud how to this came to be :). You can see how I am taking advantage of tertinary operators and nullish coalescing

    ```
    async function executeRESTMethod(
    method,
      bodyData,
      path,
      authorization,
      errorMessage
    ) {
      const response = await fetch(`${process.env.GATSBY_BLOG_API}/${path}`, {
        method,
        headers: {
          Authorization: authorization ?? '',
          'Content-Type': 'application/json'
        },
        body: bodyData ? JSON.stringify(bodyData) : null
      });

      let jsonData = {};

      const { status, statusText } = response;
      if (status === 401 && statusText === 'Unauthorized') {
        jsonData.errors = [errorMessage];
        return jsonData;
      }

      jsonData = await response.json();

      return jsonData;
    }
    ```

    -   Also another area of growth was passing functions as parameters. In checkForErrors I was using this piece of code a lot so I decided to turn it into its own function. I pass the setErrors (useState hook) and it works. I like how I use nullish coalescing to check if it has errors. If it does not have errors, then it will be empty string and the if statement will not activate.

    ```
    function checkForErrors(data, setErrors) {
    	const errors = data.errors ?? '';

      if (errors) {
        setErrors(errors);
        return;
      }
    }
    ```

-   React Features

    -   I had this issue where I did not want the user to proceed to pages that were a part of the dashboard url. If they were not logged in, then it will redirect them back to the login page. The ideal way to solve this will be: to have all the pages nested inside the pages/dashboard directory and in the index.js of the dashboard directory have the auth check there.
    -   My mistake was that I did not design it like this. The templates `action_post` and `post_detail` where not nested. I had to check for the user logged in all the pages. **_Next Time: I am going to practice nested pages_**

    -   useEffect vs Immediate Call
        -   As I was trying to implement auth check on each page. I first tried using a useEffect. This was not helping since I did not want the other components to execute if there was an error. If the components rendered it would cause a memory leak since a REST Method was trying to be executed.
            -   By using the useEffect, it will first render the child component inside the return statement.
            -   In this case the child component being rendered had a useEffect that did a REST Method
            -   Then it will try to do the useEffect inside the child component, it will not finish since the previous useEffect got activated and redirected user back to the login page since they are not logged in
            -   It left the useEffect in the child component causing a memory leak
        -   To fix the error, I wanted to immediately check for authentication. The way of doing this behavior is by just calling the function that check for authentication! No need to put it in a useEffect, **_By just using the function, it will execute immediately_**
    -   I have a better understanding of how to client fetch and the flags that can help when waiting for the data to load. [In this example](https://reactjs.org/docs/faq-ajax.html) they use the `isLoaded` and `errors` state variables. I did the same approach and it makes sense what we need to do when trying to wait for the data to load

-   Using Reusable Code

    -   For Reusable Components

        -   Everytime I saw a piece of JXS that I was using a lot I turn in into a component. It made it easier to use and pass around the data. For example, in `Errors`. I just give it a list of errors and pass this component where ever I need it

        ```
        function Errors({ errors }) {
        return (
        <div className='errorContainer text-center my-9'>
        <h3 className='font-lora font-bold text-2xl underline'>Oops</h3>

                <div className='my-4'>
                  {errors.map((error, index) => {
                    return (
                      <p key={index} className='font-lato text-md'>
                        {error}
                      </p>
                    );
                  })}
                </div>
              </div>
            );

        }
        ```

        -   Button is also another reusable component. I like how I made the it reusable in in the color since if I do not pass a color then it will default to `bg-linearBlue`. Then it also uses buttonAction based on the message passed in. I do see that there are areas where I am doing the same thing such as

            -   `Go Back To Post`
            -   `Log In`
            -   `Delete Post`
            -   `Delete Comment`
                This can be better implemented. Next time, I can try using flags passed in where this flags can group similar actions together such as passing in a delete flag then I can do a shared action

            ```
            function Button(props) {
              const { buttonMessage } = props;
              const color = props.color ?? 'bg-linearBlue';

              function buttonAction() {
                if (
                  buttonMessage === 'Go Back' ||
                  buttonMessage === 'Go Back To Dashboard'
                ) {
                  return navigate('/dashboard');
                } else if (buttonMessage === 'Update Post') {
                  return navigate(props.path + '?update');
                } else if (buttonMessage === 'Create a New Post') {
                  return navigate(props.path + '?create');
                } else if (buttonMessage === 'Submit') {
                  return props.handleSubmit();
                } else if (buttonMessage === 'Go Back To Post') {
                  return navigate(props.path);
                } else if (buttonMessage === 'Log In') {
                  return navigate(props.path);
                } else if (buttonMessage === 'Delete Post') {
                  return props.handlePostDelete();
                } else if (buttonMessage === 'Delete Comment') {
                  return props.handleCommentDelete();
                }
              }

              return (
                <button
                  type='button'
                  className={`font-lora p-2 rounded-lg text-white ${color} text-center mt-6 flex m-auto`}
                  onClick={() => buttonAction()}
                >
                  {buttonMessage}
                </button>
              );
            }
            ```

## Next Steps

-   **On the next project, here are some things I want to learn and continue practicing**
    -   Practice React features and get comfortable with knowing when to use certain tools such as useEffect
    -   Continue praticing this [client-side data fetching pattern](https://reactjs.org/docs/faq-ajax.html)
    -   Continue doing Reusable components and util functions
    -   Continue learning new features of Gatsby and practice between knowing when to use client-side fetching and build-time fetching
    -   I want to simplify my code by using JS built in function (DO NOT RECREATE THE WHEEL)
        -   Continue using nullish coalescing and learn other patterns
-   **New Things To Try**
    -   Typescript
    -   SWR Hooks
    -   Gatsby Nested Pages

## Technologies:

-   Gatsby
-   Tailwind
-   Netlify
-   JWT
