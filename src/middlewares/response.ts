import { Middleware } from '../../types/middleware';

export const useResponse: Middleware = async (
  context,
  next,
) => {
  const { response, bodyReplace } = context;
  if (!response || !bodyReplace || !response.body) {
    await next();
    return;
  }

  const contentType = response.headers.get('content-type');

  // we don't know the content-type, so we can't modify the body
  if (!contentType) {
    await next();
    return;
  }

  let bodyText: string | undefined;
  if (contentType.includes('text/')) {
    // just replace the target string with desired value
    bodyText = await response.text();
  } else if (contentType === 'application/json') {
    bodyText = await response.json();
  }

  if (!bodyText) {
    await next();
    return;
  }

  bodyReplace.forEach(({ target, newValue }): void => {
    bodyText = bodyText!.replaceAll(target, newValue);
  });

  context.response = new Response(bodyText, response);
  await next();
};
