<template>
  <div class="flex flex-col text-md md:text-lg w-full px-6 md:px-16 mt-8 gap-3">
    <h1 class="text-3xl text-primary font-bold">
      {{ $t('cookiesPolicy.title')}}
    </h1>
    <p class="text-sm md:text-md italic">{{$t('cookiesPolicy.lastUpdated')}} 09/10/2024</p>
    <div class="flex flex-col gap-2">
      <h3 class="text-xl font-bold">{{ $t('cookiesPolicy.1-Intro')}}</h3>
      <p>
        {{ $t('cookiesPolicy.1-Intro-Description')}}
      </p>
    </div>
    <div class="flex flex-col gap-2">
      <h3 class="text-xl font-bold">{{ $t('cookiesPolicy.2-Cookies')}}</h3>
      <p>{{ $t('cookiesPolicy.2-Cookies-Description')}}</p>
      <ul class="flex flex-col gap-4 pl-4">
        <li>
          <span class="font-bold">{{ $t('cookiesPolicy.2-Cookies-Strict')}}</span>
          {{ $t('cookiesPolicy.2-Cookies-Strict-Description')}}
          <p class="italic font-light">
            {{ $t('cookiesPolicy.2-Cookies-Strict-Example')}}
          </p>
        </li>
        <li>
          <span class="font-bold">{{ $t('cookiesPolicy.2-Cookies-Performance')}}</span>
          {{ $t('cookiesPolicy.2-Cookies-Performance-Description')}}
          <p class="italic font-light">
            {{ $t('cookiesPolicy.2-Cookies-Performance-Example')}}
          </p>
        </li>
        <li>
          <span class="font-bold">{{ $t('cookiesPolicy.2-Cookies-Functional')}}</span>
          {{ $t('cookiesPolicy.2-Cookies-Functional-Description')}}
          <p class="italic font-light">
            {{ $t('cookiesPolicy.2-Cookies-Functional-Example')}}
          </p>
        </li>
        <li>
          <span class="font-bold">{{ $t('cookiesPolicy.2-Cookies-ThirdParty')}}</span>
          {{ $t('cookiesPolicy.2-Cookies-ThirdParty-Description')}}
          <div class="flex flex-col gap-2 md:pl-8 my-4">
            <p class="font-bold">{{ $t('cookiesPolicy.2-Cookies-ThirdParty-Used')}}</p>
            <ul class="flex flex-col gap-2 pl-4">
              <li>
                <span class="font-bold">{{ $t('cookiesPolicy.2-Cookies-ThirdParty-Auth')}}</span> {{ $t('cookiesPolicy.2-Cookies-ThirdParty-Auth-Description')}}
                <a
                  href="https://auth0.com/docs/manage-users/cookies"
                  class="underline text-primary"
                  >{{ $t('cookiesPolicy.2-Cookies-ThirdParty-Auth-Policy')}}</a
                >.
              </li>
              <li>
                <span class="font-bold">{{ $t('cookiesPolicy.2-Cookies-ThirdParty-Stripe')}}</span> {{ $t('cookiesPolicy.2-Cookies-ThirdParty-Stripe-Description')}}.
                <a
                  href="https://stripe.com/es/privacy"
                  class="underline text-primary"
                  >{{ $t('cookiesPolicy.2-Cookies-ThirdParty-Stripe-Policy')}}</a
                >.
              </li>
              <li>
                <span class="font-bold">{{ $t('cookiesPolicy.2-Cookies-ThirdParty-Google')}}</span> {{ $t('cookiesPolicy.2-Cookies-ThirdParty-Google-Description')}}
                <a
                  href="https://policies.google.com/technologies/cookies?hl=es"
                  class="underline text-primary"
                  >{{ $t('cookiesPolicy.2-Cookies-ThirdParty-Google-Policy')}}</a
                >.
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
    <div class="flex flex-col gap-2">
      <h3 class="text-xl font-bold">{{ $t('cookiesPolicy.3-ManageCookies')}}</h3>
      <p>
        {{ $t('cookiesPolicy.3-ManageCookies-Description')}}
      </p>
      <p>
        {{ $t('cookiesPolicy.3-ManageCookies-Description2')}}
      </p>
    </div>
    <div class="flex flex-col gap-2">
      <h3 class="text-xl font-bold">{{ $t('cookiesPolicy.4-ChangesPolicy')}}</h3>
      <p>
        {{ $t('cookiesPolicy.4-ChangesPolicy-Description')}}
      </p>
    </div>
    <div class="flex flex-col gap-2">
      <h3 class="text-xl font-bold">{{ $t('cookiesPolicy.5-Contact')}}</h3>
      <p>
        {{ $t('cookiesPolicy.5-Contact-Description')}}
        <NuxtLink to="/contact" class="underline text-primary"
          >{{ $t('cookiesPolicy.5-Contact-Form')}}</NuxtLink
        >.
      </p>
    </div>
  </div>
</template>
