import useReflare from '../../src';

test('response -> modified -> new response', async () => {
  const request = new Request(
    'http://localhost:8000/',
  );

  const reflare = await useReflare();
  reflare.push({
    path: '/*',
    upstream: { domain: 'google.com' },
    bodyReplace: [{
      target: 'google.com',
      newValue: 'foobar.com',
    }],
  });

  const response = await reflare.handle(request);

  expect(response.status).toBe(200);
  expect(await response.text()).toContain('foobar.com');
});
