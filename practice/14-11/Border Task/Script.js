document.addEventListener('DOMContentLoaded', function () {

    const boxExample = document.querySelector('.box-model-example');

    // Margin sliders
    const marginTopSlider = document.getElementById('margin-top');
    const marginRightSlider = document.getElementById('margin-right');
    const marginBottomSlider = document.getElementById('margin-bottom');
    const marginLeftSlider = document.getElementById('margin-left');

    // Display fields
    const marginTopValue = document.getElementById('margin-top-value');
    const marginRightValue = document.getElementById('margin-right-value');
    const marginBottomValue = document.getElementById('margin-bottom-value');
    const marginLeftValue = document.getElementById('margin-left-value');

    // Border & padding
    const borderSlider = document.getElementById('border');
    const paddingSlider = document.getElementById('padding');
    const borderValue = document.getElementById('border-value');
    const paddingValue = document.getElementById('padding-value');


    // Update margins
    function updateMargins() {
        const top = marginTopSlider.value + 'px';
        const right = marginRightSlider.value + 'px';
        const bottom = marginBottomSlider.value + 'px';
        const left = marginLeftSlider.value + 'px';

        boxExample.style.marginTop = top;
        boxExample.style.marginRight = right;
        boxExample.style.marginBottom = bottom;
        boxExample.style.marginLeft = left;

        marginTopValue.textContent = top;
        marginRightValue.textContent = right;
        marginBottomValue.textContent = bottom;
        marginLeftValue.textContent = left;
    }

    // Add events for margin sliders
    [marginTopSlider, marginRightSlider, marginBottomSlider, marginLeftSlider].forEach(slider => {
        slider.addEventListener('input', updateMargins);
    });

    // Border width slider
    borderSlider.addEventListener('input', function () {
        const value = this.value + 'px';
        boxExample.style.borderWidth = value;
        borderValue.textContent = value;
    });

    // Padding slider
    paddingSlider.addEventListener('input', function () {
        const value = this.value + 'px';
        boxExample.style.padding = value;
        paddingValue.textContent = value;
    });

    // Initialize default values
    updateMargins();
});
