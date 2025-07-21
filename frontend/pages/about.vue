<template>
    <div class="flex flex-row justify-center w-full mt-4">
        <div class="flex flex-col w-full px-6 md:px-0 md:w-2/3 gap-3">
            <div class="flex flex-row justify-start">
                <h1 class="text-3xl text-primary font-bold"> {{ $t('footer.aboutUs') }}</h1>
            </div>
            <p>Evente es una plataforma dinámica y versátil dedicada a la difusión y promoción de eventos de diversas categorías, diseñada para conectar a los organizadores con su público objetivo de manera eficiente. Nuestro sitio web ofrece una experiencia intuitiva tanto para los usuarios que buscan eventos emocionantes como para las empresas que desean promocionar sus productos o servicios a través de campañas publicitarias estratégicas.</p>
            <p>En Evente, puedes encontrar una amplia gama de eventos, desde espectáculos de danza y conciertos de música, hasta charlas inspiradoras, obras de teatro, exposiciones de arte y talleres educativos. Cada evento está cuidadosamente categorizado, lo que permite a los usuarios explorar y descubrir nuevas experiencias según sus intereses. Además, ofrecemos herramientas personalizadas que permiten filtrar eventos por fecha, ubicación o tipo, asegurando que cada usuario encuentre actividades que se ajusten a sus preferencias.</p>
            <p>Pero Evente no es solo un sitio de eventos. También proporcionamos un espacio para que las empresas y marcas promocionen sus ofertas a través de campañas de publicidad especializadas. Las empresas pueden aprovechar nuestras "promociones" para destacar sus productos o servicios en la plataforma, garantizando una visibilidad adecuada ante una audiencia segmentada y comprometida.</p>
            <p>Nos enorgullece ser un puente entre la cultura, el arte, la educación y los negocios, creando un ecosistema donde tanto los organizadores de eventos como las empresas tienen las herramientas necesarias para atraer al público adecuado. Ya sea que busques asistir a un evento cultural, educativo o recreativo, o que desees promocionar tu negocio mediante anuncios y promociones, Evente es el lugar ideal para ti. ¡Explora, participa y conecta con experiencias únicas en un solo clic!</p>
        </div>
    </div>
</template>

<script setup>
const { t } = useI18n()

useHead({
  title: 'Evente - Sobre nosotros',
  meta: [
    {
      name: 'description',
      content:
        'Descubre la misión y valores de Evente. Conectamos a organizadores y asistentes en Canarias.',
    },
    { property: 'og:title', content: 'Evente - Sobre nosotros' },
    {
      property: 'og:description',
      content:
        'Descubre la misión y valores de Evente. Conectamos a organizadores y asistentes en Canarias.',
    },
    { property: 'og:url', content: 'https://evente.es/about' },
  ],
  link: [{ rel: 'canonical', href: 'https://evente.es/about' }],
})
</script>