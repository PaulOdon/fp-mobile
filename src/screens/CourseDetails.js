import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Badge, Button } from 'react-native-elements';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as customerService from './../services/Customer.service';
import * as receiverService from './../services/Receiver.service';
import * as courseService from './../services/Course.service';
import * as photoService from './../services/Photo.service';
import Loading from '../components/shared/Loading';

const CourseDetails = ({ route, navigation }) => {
    const [token, setToken] = useState('');
    const [customer, setCustomer] = useState({});
    const [receiver, setReceiver] = useState({});
    const [isloading, setIsLoading] = useState(false);
    const [allPhoto, setAllPhoto] = useState([]);
    const customerId = route.params.customerId;
    const receiverId = route.params.receiverId;
    const course = route.params;
    const photos = route.params.photo;

    const apiOptions = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const getImageInfo = async photos => {
        for (const photo of photos) {
            let res = await photoService.getImage(photo.URL, apiOptions);
            let photoOne = {
                name: photo.orignialName,
                url: res
            };
            setAllPhoto((allPhoto) => [...allPhoto, photoOne]);
        };
        console.log(count)
    };

    const getStoredUser = async () => {
        try {
            const userData = JSON.parse(await AsyncStorage.getItem('user'));
            setToken(userData.access_token);
            apiOptions.headers.Authorization = `Bearer ${userData.access_token}`;
        } catch (error) {
            console.log(error);
        }
    };

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const customerData = await customerService.getOneCustomer(
                customerId,
                apiOptions,
            );
            const receiverData = await receiverService.getOneReceiver(
                receiverId,
                apiOptions,
            );
            setCustomer(customerData);
            setReceiver(receiverData);
            setIsLoading(false);
        } catch (error) {
            console.log('error : ', error);
        }
        setIsLoading(false);
    };

    useEffect(() => {
    }, [allPhoto]);

    useEffect(() => {
        getStoredUser();
        fetchData();
    }, [token, customerId, receiverId]);

    useEffect(() => {
        (async () => {
            await getImageInfo(photos);
        })();
    }, []);

    return (
        <>
            <ScrollView>
                <View
                    style={{
                        backgroundColor: '#EBEBEB',
                        marginHorizontal: 15,
                        marginTop: 15,
                        padding: 10,
                        borderRadius: 10,
                    }}>
                    <Text style={{ fontWeight: '700' }}>Détails de la course</Text>
                    <Text>Numéro : {course.numero}</Text>
                    <Text>
                        Date de création : {moment(course.createDate).format('DD/MM/YYYY')}
                    </Text>
                    <Text>Commentaire : {course.comment}</Text>
                    <Text></Text>
                    <Text>
                        Status : <Badge value={course.status.name} />
                    </Text>
                    {course.status.id === 2 && (
                        <Button
                            type="link"
                            title="Terminer la livraison"
                            onPress={() => navigation.navigate('Scan', { isToDeliver: true })}
                        />
                    )}
                    {course.status.id === 4 && (
                        <Button
                            type="link"
                            title="Commencer la livraison"
                            onPress={() =>
                                navigation.navigate('Scan', { toFinishingCourse: true })
                            }
                        />
                    )}
                    {photos.length > 0 && (
                        <View>
                            <Text></Text>
                            <Text>Preuve de livraison</Text>
                            <ScrollView horizontal>
                                <View
                                    style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                    }}>
                                    {allPhoto.map((photo, index) => (
                                        <View style={{ marginRight: 10 }}>
                                            <Image
                                                key={index}
                                                source={{ uri: `data:image/png;base64,${photo.url}` }}
                                                style={{
                                                    width: 100,
                                                    height: 100,
                                                    borderRadius: 10,
                                                }}
                                            />
                                        </View>
                                    ))}
                                </View>
                            </ScrollView>
                        </View>
                    )}
                </View>
                <View
                    style={{
                        backgroundColor: '#EBEBEB',
                        marginHorizontal: 15,
                        marginTop: 15,
                        padding: 10,
                        borderRadius: 10,
                    }}>
                    <Text style={{ fontWeight: '700' }}>Expéditeur</Text>
                    {isloading ? (
                        <Loading />
                    ) : (
                        customer != null && (
                            <View>
                                <Text>
                                    Nom et prénoms :{' '}
                                    {customer.firstName + ' ' + customer.lastName}
                                </Text>
                                <Text>Téléphone : {customer.phone}</Text>
                                <Text>Ville : {customer.city}</Text>
                                <Text>Code Postale : {customer.zipCode}</Text>
                                <Text>Adresse 1 : {customer.addressOne}</Text>
                                {customer.addressTwo != null && (
                                    <Text>Adresse 2 : {customer.addressTwo}</Text>
                                )}
                                <Text>Compagnie : {customer.companyName}</Text>
                            </View>
                        )
                    )}
                </View>
                <View
                    style={{
                        backgroundColor: '#EBEBEB',
                        marginHorizontal: 15,
                        marginTop: 15,
                        padding: 10,
                        borderRadius: 10,
                    }}>
                    <Text style={{ fontWeight: '700' }}>Destinataire</Text>
                    {isloading ? (
                        <Loading />
                    ) : (
                        receiver != null && (
                            <View>
                                <Text>
                                    Nom et prénoms :{' '}
                                    {receiver.firstName + ' ' + receiver.lastName}
                                </Text>
                                <Text>Téléphone : {receiver.phone}</Text>
                                <Text>Ville : {receiver.city}</Text>
                                <Text>Code Postale : {receiver.zipCode}</Text>
                                <Text>Adresse 1 : {receiver.addressOne}</Text>
                                {receiver.addressTwo != null && (
                                    <Text>Adresse 2 : {receiver.addressTwo}</Text>
                                )}
                                <Text>Compagnie : {receiver.companyName}</Text>
                            </View>
                        )
                    )}
                </View>
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({});

export default CourseDetails;
