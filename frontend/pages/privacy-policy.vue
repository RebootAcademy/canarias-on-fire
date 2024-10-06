<template>
  <div class="flex flex-row justify-center w-full mt-4">
    <div class="flex flex-col w-full px-6 md:px-0 md:w-2/3 gap-3">
      <div class="flex flex-row justify-start text-sm md:text-md">
        <h1 class="text-3xl text-primary font-bold">
          {{ $t('footer.privacy') }}
        </h1>
      </div>
      <p class="font-bold text-md md:text-lg">1. Información que Recopilamos</p>
      <ul>
        <li>
          Información personal: Recopilamos la información que
          proporcionas al registrarte en nuestro sitio, como tu nombre,
          dirección de correo electrónico y cualquier otra información que
          decidas compartir con nosotros.
        </li>
      </ul>
      <p class="font-bold text-md md:text-lg">2. Uso de la Información</p>
      <p>La información que recopilamos se utiliza para:</p>
      <ul>
        <li>Proporcionar y mejorar nuestros servicios.</li>
        <li>
          Enviarte actualizaciones sobre eventos, promociones y otras
          comunicaciones relacionadas con nuestros servicios.
        </li>
        <li>
          Personalizar tu experiencia en nuestra plataforma según tus intereses
          y preferencias.
        </li>
      </ul>
      <p class="font-bold text-md md:text-lg">3. Compartir Información</p>
      <p>
        No compartimos tu información personal con terceros, salvo en los
        siguientes casos:
      </p>
      <ul>
        <li>Cuando sea necesario para cumplir con las leyes aplicables.</li>
        <li>
          Para proteger los derechos, propiedad o seguridad de Evente,
          nuestros usuarios u otros.
        </li>
        <li>
          Con proveedores de servicios que nos ayudan a operar la plataforma
          (bajo estrictos acuerdos de confidencialidad).
        </li>
      </ul>
      <p class="font-bold text-md md:text-lg">4. Seguridad de la Información</p>
      <p>
        Nos comprometemos a proteger tu información personal mediante el uso de
        medidas de seguridad adecuadas. Sin embargo, ten en cuenta que ninguna
        transmisión de datos por internet es completamente segura.
      </p>
      <p class="font-bold text-md md:text-lg">5. Tus Derechos</p>
      <p>
        Tienes derecho a acceder, corregir o eliminar tu información personal en
        cualquier momento. Si deseas ejercer estos derechos o tienes preguntas
        sobre nuestra política de privacidad, puedes contactarnos a través de
        los medios disponibles en nuestro sitio.
      </p>
      <p>
        Evente se reserva el derecho de modificar esta política en cualquier
        momento. Las actualizaciones se publicarán en esta página.
      </p>
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n()
</script>
