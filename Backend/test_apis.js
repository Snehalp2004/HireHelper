const http = require('http');

function apiCall(method, path, data, token) {
  return new Promise((resolve, reject) => {
    const body = data ? JSON.stringify(data) : '';
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (body) headers['Content-Length'] = Buffer.byteLength(body);

    const req = http.request({
      hostname: 'localhost', port: 5000, path, method, headers
    }, (res) => {
      let result = '';
      res.on('data', (c) => result += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(result) }); }
        catch (e) { resolve({ status: res.statusCode, data: result }); }
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function test() {
  console.log('=== TESTING HIREHELPER APIs ===\n');

  // 1. Login User 1
  let res = await apiCall('POST', '/api/auth/login', { email_id: 'umoney2004@gmail.com', password: '123456' });
  console.log('1. Login User1:', res.status === 200 ? 'PASS' : 'FAIL', '- Status:', res.status);
  const token1 = res.data.token;
  const user1Name = res.data.user?.first_name + ' ' + res.data.user?.last_name;
  console.log('   User:', user1Name);

  // 2. Login User 2
  res = await apiCall('POST', '/api/auth/login', { email_id: '4al22cs097@aiet.org.in', password: '123456' });
  console.log('2. Login User2:', res.status === 200 ? 'PASS' : 'FAIL', '- Status:', res.status);
  const token2 = res.data.token;
  const user2Name = res.data.user?.first_name + ' ' + res.data.user?.last_name;
  console.log('   User:', user2Name);

  // 3. Get My Tasks (User1)
  res = await apiCall('GET', '/api/tasks/my', null, token1);
  console.log('3. My Tasks (User1):', res.status === 200 ? 'PASS' : 'FAIL', '- Count:', Array.isArray(res.data) ? res.data.length : 'N/A');

  // 4. Get Feed (User1 - shows User2's tasks)
  res = await apiCall('GET', '/api/tasks', null, token1);
  console.log('4. Feed (User1):', res.status === 200 ? 'PASS' : 'FAIL', '- Count:', Array.isArray(res.data) ? res.data.length : 'N/A');

  // 5. Get Feed (User2 - shows User1's tasks)
  res = await apiCall('GET', '/api/tasks', null, token2);
  console.log('5. Feed (User2):', res.status === 200 ? 'PASS' : 'FAIL', '- Count:', Array.isArray(res.data) ? res.data.length : 'N/A');

  // 6. Get My Tasks (User2)
  res = await apiCall('GET', '/api/tasks/my', null, token2);
  console.log('6. My Tasks (User2):', res.status === 200 ? 'PASS' : 'FAIL', '- Count:', Array.isArray(res.data) ? res.data.length : 'N/A');

  // 7. Create a task from User1
  res = await apiCall('POST', '/api/tasks', { title: 'Test Task from API', description: 'Testing edit/delete', location: 'Remote' }, token1);
  console.log('7. Create Task (User1):', res.status === 201 ? 'PASS' : 'FAIL', '- Status:', res.status);
  const newTaskId = res.data?.task?.id;
  console.log('   Task ID:', newTaskId);

  // 8. Edit the task
  if (newTaskId) {
    res = await apiCall('PUT', `/api/tasks/${newTaskId}`, { title: 'Test Task EDITED', description: 'Updated via API', location: 'Office' }, token1);
    console.log('8. Edit Task:', res.status === 200 ? 'PASS' : 'FAIL', '- Status:', res.status, '- Msg:', res.data?.msg);
  }

  // 9. Delete the task
  if (newTaskId) {
    res = await apiCall('DELETE', `/api/tasks/${newTaskId}`, null, token1);
    console.log('9. Delete Task:', res.status === 200 ? 'PASS' : 'FAIL', '- Status:', res.status, '- Msg:', res.data?.msg);
  }

  // 10. Get Incoming Requests (User1)
  res = await apiCall('GET', '/api/tasks/incoming-requests', null, token1);
  console.log('10. Incoming Requests (User1):', res.status === 200 ? 'PASS' : 'FAIL', '- Count:', Array.isArray(res.data) ? res.data.length : 'N/A');

  // 11. Get My Applied Tasks (User1)
  res = await apiCall('GET', '/api/tasks/my-applied', null, token1);
  console.log('11. My Applied Tasks (User1):', res.status === 200 ? 'PASS' : 'FAIL', '- Count:', Array.isArray(res.data) ? res.data.length : 'N/A');

  // 12. Forgot Password
  res = await apiCall('POST', '/api/auth/forgot-password', { email_id: 'umoney2004@gmail.com' });
  console.log('12. Forgot Password:', res.status === 200 ? 'PASS' : 'FAIL', '- Status:', res.status, '- Msg:', res.data?.msg);

  // 13. Reset Password (with wrong OTP - should fail)
  res = await apiCall('POST', '/api/auth/reset-password', { email_id: 'umoney2004@gmail.com', otp: '000000', new_password: 'newpass', confirm_password: 'newpass' });
  console.log('13. Reset Password (wrong OTP):', res.status === 400 ? 'PASS (expected fail)' : 'FAIL', '- Msg:', res.data?.msg);

  // 14. Reset Password (mismatched passwords)
  res = await apiCall('POST', '/api/auth/reset-password', { email_id: 'umoney2004@gmail.com', otp: '123456', new_password: 'abc', confirm_password: 'def' });
  console.log('14. Reset (mismatch):', res.status === 400 ? 'PASS (expected fail)' : 'FAIL', '- Msg:', res.data?.msg);

  console.log('\n=== ALL API TESTS COMPLETE ===');
}

test().catch(err => console.error('Test error:', err.message));
