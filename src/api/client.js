import {config, getApiUrl} from './config';

const Client = {
  login: params => config.post('/wp-json/learnpress/v1/token', params),

  register: params => {
    console.log('Register Params:', params);
    return config.post('/wp-json/learnpress/v1/token/register', params);
  },

  course: (params = {}, randomVersion = true) => {
    console.log(params);
    return config.get(
      '/wp-json/learnpress/v1/courses',
      {...params},
      randomVersion,
    );
  },
  Newcourse: (params = {}, randomVersion = true) => {
    console.log(params);
    return config.get(
      '/wp-json/learnpress/v1/courses1',
      {...params},
      randomVersion,
    );
  },
  Newcourse2: (params = {}, randomVersion = true) => {
    console.log('Newcourse2 params:', params );
    return config.get(
      '/wp-json/learnpress/v1/courses2',
      {...params},
      randomVersion,
    );
  },

  courseDetailNewRestrict: id =>
    config.get(`/wp-json/learnpress/v1/courses3?courses_id=${id}`),

  courseDetail: id => config.get(`/wp-json/learnpress/v1/courses/${id}`),

  lessonWithId: (id, params = {}) =>
    config.get(`/wp-json/learnpress/v1/lessons/${id}`, {...params}),

  lesson: params => config.get('/wp-json/learnpress/v1/lessons', {...params}),

  finishCourse: params =>
    config.post('/wp-json/learnpress/v1/courses/finish', params),

  retakeCourse: params =>
    config.post('/wp-json/learnpress/v1/courses/retake', params),

  enroll: params =>
    config.post('/wp-json/learnpress/v1/courses/enroll', params),

  completeLesson: params =>
    config.post('/wp-json/learnpress/v1/lessons/finish', params),

  quiz: (id, params = {}) =>
    config.get(`/wp-json/learnpress/v1/quiz/${id}`, {...params}),

  quizStart: params => config.post('/wp-json/learnpress/v1/quiz/start', params),

  quizFinish: params =>
    config.post('/wp-json/learnpress/v1/quiz/finish', params),

  quizRetake: params =>
    config.post('/wp-json/learnpress/v1/quiz/retake', params),

  allUser: params => config.get('/wp-json/learnpress/v1/users', {...params}),

  getUser: id => config.get(`/wp-json/learnpress/v1/users/${id}`),

  updateUser: (id, params) =>
    config.multipartPost(`/wp-json/learnpress/v1/users/${id}`, params),

  getOverview: id =>
    config.get(`/wp-json/learnpress/v1/courses/${id}`, {
      optimize:
        'intructor,meta_data,on_sale,count_students,can_finish,can_retake,ratake_count,rataken,duration,tags,categories,rating,price,origin_price,sale_price',
    }),

  getCategory: params =>
    config.get('/wp-json/wp/v2/course_category', {...params}),

  addRemoveWishlist: params =>
    config.post('/wp-json/learnpress/v1/wishlist/toggle', params),

  getWishlist: params =>
    config.get('/wp-json/learnpress/v1/wishlist', {...params}),

  getWishlistWithId: id =>
    config.get(`/wp-json/learnpress/v1/wishlist/course/${id}`),

  getAssignment: id => config.get(`/wp-json/learnpress/v1/assignments/${id}`),

  startAssignment: params =>
    config.post('/wp-json/learnpress/v1/assignments/start/', params),

  retakeAssignment: params =>
    config.post('/wp-json/learnpress/v1/assignments/retake/', params),

  saveSendAssignment: params =>
    config.multipartPost('/wp-json/learnpress/v1/assignments/submit/', params),

  deleteFileAssignment: params =>
    config.post(
      '/wp-json/learnpress/v1/assignments/delete-submit-file/',
      params,
    ),

  topCoursesWithStudent: (isLoggedIn = false) =>
    config.get(
      '/wp-json/learnpress/v1/courses',
      {
        popular: false,

        restrict: 'public',
      },
      false,
    ),

  newCourses: () =>
    config.get(
      '/wp-json/learnpress/v1/courses1',
      {
        order: 'desc',
        optimize: true,
        status: 'publish',
      },
      false,
    ),

  getIntructor: params =>
    config.get('/wp-json/learnpress/v1/users', {...params}),

  getCategoryHome: () =>
    config.get(
      '/wp-json/learnpress/v1/course_category',
      {
        orderby: 'count',
        order: 'desc',
      },
      false,
    ),
  getReview: (id, params) =>
    config.get(`/wp-json/learnpress/v1/review/course/${id}`, params),

  createReview: param =>
    config.post('/wp-json/learnpress/v1/review/submit', param),

  checkAnswer: params =>
    config.post('/wp-json/learnpress/v1/quiz/check_answer', params),

  resetEmail: params =>
    config.post('/wp-json/learnpress/v1/users/reset-password', params),

  changePassword: params =>
    config.post('/wp-json/learnpress/v1/users/change-password', params),

  verifyReceipt: params =>
    config.post('/wp-json/learnpress/v1/courses/verify-receipt', params),

  deleteAccount: params =>
    config.post('/wp-json/learnpress/v1/users/delete', params),

  getProductIAP: params =>
    config.get('/wp-json/lp/v1/mobile-app/product-iap', {...params}),

  registerFCMToken: params =>
    config.post('/wp-json/learnpress/v1/push-notifications/register-device', {
      ...params,
    }),

  deleteFCMToken: params =>
    config.post('/wp-json/learnpress/v1/push-notifications/delete-device', {
      ...params,
    }),

  getNotifications: params =>
    config.get('/wp-json/learnpress/notifications/v1/notifications', {
      ...params,
    }),

  getCertificates: params =>
    config.get('/wp-json/custom-api/v2/get-certificate-url', {
      ...params,
    }),

finishCourseCustom: async params => {
    const url = getApiUrl() + '/wp-json/custom-api/v1/finish-course';

    try {
      console.log('finishCourseCustom URL:', url);
      console.log('finishCourseCustom PAYLOAD:', params);

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      const raw = await res.text();

      console.log('finishCourseCustom STATUS:', res.status);
      console.log('finishCourseCustom RAW RESPONSE:', raw);

      try {
        const parsed = JSON.parse(raw);
        console.log('finishCourseCustom PARSED RESPONSE:', parsed);
        return parsed;
      } catch (e) {
        console.log('finishCourseCustom JSON PARSE ERROR:', e.message);
        return null;
      }
    } catch (err) {
      console.log('finishCourseCustom FETCH ERROR:', err);
      return null;
    }
  },
    
};

export default Client;
