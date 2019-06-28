import {
    LightningElement,
    track,
    wire
} from 'lwc';
import getActiveUsers from '@salesforce/apex/PF_User_Statistics.getActiveUsers';
import getActiveAdminUsers from '@salesforce/apex/PF_User_Statistics.getActiveAdminUsers';
import getUserProfiles from '@salesforce/apex/PF_User_Statistics.getUserProfile';
import {
    loadScript
} from 'lightning/platformResourceLoader';
import chartjs from '@salesforce/resourceUrl/chart';
import {
    ShowToastEvent
} from 'lightning/platformShowToastEvent';

export default class PfUserStats extends LightningElement {
    @track countActiveUser;
    @track countActiveAdminUser;
    @track error;
    @track profName;
    @track profId;
    @track profCount;
    @track bgColor;
    
    @track config;
    @track chart;
    chartjsInitialized = false;


    @wire(getActiveUsers) actUser({
        error,
        data
    }) {
        if (data) {
            this.countActiveUser = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.countActiveUser = undefined;
        }
    }

    @wire(getActiveAdminUsers) adminUser({
        error,
        data
    }) {
        if (data) {
            this.countActiveAdminUser = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.countActiveAdminUser = undefined;
        }
    }

    @wire(getUserProfiles) userProfiles({
        error,
        data
    }) {
        this.profName = [];
        this.profId = [];
        this.profCount = [];
        this.bgColor = [];
        if (data) {
            data.forEach(prof => {
                this.profName.push([prof.profileName]);
                this.profId.push([prof.profileId]);
                this.profCount.push([prof.countUsers]);
                console.log('random... ' + this.random_rgba());
                this.bgColor.push([this.random_rgba()]);
            });

            this.startChartJS();
        } else if (error) {
            this.error = error;
        }
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    random_rgba() {
        var r = this.getRandomInt(0, 255);
        var g = this.getRandomInt(0, 255);
        var b = this.getRandomInt(0, 255);

        return 'rgb(' + r + "," + g + "," + b + ')';
    }


    connectedCallback() {
        loadScript(this, chartjs)
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error loading ERROR',
                        message: error.message,
                        variant: 'error',
                    }),
                );
            });
    }

    startChartJS() {
        this.config = {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: this.profCount,
                    backgroundColor: this.bgColor,
                    hoverBackgroundColor: this.bgColor,
                    hoverBorderWidth: 5,
                    id: this.profId
                }],
                labels: this.profName
            },
            options: {
                responsive: true,
                legend: {
                    position: 'top'
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                },
                events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'],
                onClick: function(evt){
                    var item = this.chart.getElementAtEvent(evt);

                    //ON CLICK DO SOMETHING HERE LIKE GIVE ME PROFILE ID SO THAT WE CAN PASS IT INTO ANOTHER COMPONENT
                    //alert(item);
                    console.log('onClick ' );//+data.datasets[0].data[item[0]._index]);
                    console.log('what is my item ' +item);
                    console.log('what is my item 2 ', item[0]._chart);
                    console.log('what is my item 3 ' +JSON.stringify(item[0]._chart));
                    //data.labels[tooltipItem.index]
                    //window.location.href = '/lightning/r/Account/' + evt[] + '/view';
                }
            }
        };

        const ctx = this.template
            .querySelector('canvas.donut')
            .getContext('2d');
        this.chart = new window.Chart(ctx, this.config);

    }
}