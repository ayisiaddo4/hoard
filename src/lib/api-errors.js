/**
|--------------------------------------------------
| Check Fetch responses for errors during API calls
|--------------------------------------------------
*
*  Since the request completes, even with errors, we
*  should check the API response to make sure it
*  really succeeded. If not, let's throw errors.
*
*/

export async function handleApiErrors(response) {
  if (!response.ok) {
    let errors = [];
    try {
      let body = await response.text();

      try {
        const json = JSON.parse(body);
        if (json.errors) {
          errors.push(...json.errors);
        } else {
          errors.push(json);
        }
      } catch (e) {
        errors.push(body);
      }
    } catch (e) {
      errors.push('An error occurred validating your request.');
    }
    const err = new Error('An API Error occurred');
    err.errors = errors;
    throw err;
  }
  return response;
}

export function getErrorMessage(error) {
  return (
    (error.errors && error.errors[0] && error.errors[0].message) ||
    error.message
  );
}
